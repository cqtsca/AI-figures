import { reactive } from 'vue'
import * as engine from './engine.js'
import { queueLockCommand, queueUnlockCommand } from '../api/device.js'
import { createPayment, mockPaySuccess, splitToDealer } from '../api/huiju.js'

const STORAGE_KEY = 'chenglin-sales-v1'

function load() {
  try {
    if (typeof uni !== 'undefined' && uni.getStorageSync) {
      const raw = uni.getStorageSync(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    }
  } catch (error) {
    console.warn('restore failed', error)
  }
  return engine.seedState()
}

function persist(state) {
  try {
    if (typeof uni !== 'undefined' && uni.setStorageSync) {
      uni.setStorageSync(STORAGE_KEY, JSON.stringify(state))
    }
  } catch (error) {
    console.warn('persist failed', error)
  }
}

export const store = reactive({
  ...load()
})

function commit() {
  persist(store)
}

export function resetDemo() {
  const fresh = engine.seedState()
  Object.keys(store).forEach((key) => {
    delete store[key]
  })
  Object.assign(store, fresh)
  commit()
}

export function loginAs(role) {
  const result = engine.login(store, role)
  if (result.ok) commit()
  return result
}

export function logout() {
  engine.logout(store)
  commit()
}

export function currentRole() {
  return store.session
}

export function mallForViewer() {
  if (store.session && store.session.role === 'customer') {
    return engine.customerMallItems(store)
  }
  return engine.mallItems(store)
}

export function listingStatusLabel(status) {
  return (
    {
      draft: '草稿',
      pending_finance: '待财务审价',
      pending_admin: '待管理员终审',
      approved: '已上架'
    }[status] || status
  )
}

export function formatCny(value, placeholder) {
  if (value == null) return '待定价'
  if (placeholder) return `演示价 ¥${value}`
  return `¥${value}`
}

export async function checkout({
  skuId,
  method,
  source,
  dealerId,
  idUploaded,
  orgLicense,
  signed
}) {
  const placed = engine.placeOrder(store, {
    skuId,
    method,
    source,
    dealerId,
    idUploaded,
    orgLicense,
    signed
  })
  if (!placed.ok) return placed
  const prepay = await createPayment({
    orderId: placed.order.id,
    amountCny: placed.order.dueNow,
    subject: placed.order.skuName,
    payer: store.session.id
  })
  if (!prepay.ok) return prepay
  const paid = await mockPaySuccess(prepay)
  if (!paid.ok) return paid
  const applied = engine.applyHuijuPayment(store, {
    orderId: placed.order.id,
    payment: paid
  })
  commit()
  return applied
}

export function saveListing(patch) {
  const result = engine.submitListingDraft(store, patch)
  if (result.ok) commit()
  return result
}

export function decideListing(payload) {
  const result = engine.reviewListing(store, payload)
  if (result.ok) commit()
  return result
}

export function saveCommercial(patch) {
  const result = engine.submitCommercialDraft(store, patch)
  if (result.ok) commit()
  return result
}

export function decideCommercial(payload) {
  const result = engine.reviewCommercial(store, payload)
  if (result.ok) commit()
  return result
}

export function scanDeliver(payload) {
  const result = engine.deliverByScan(store, payload)
  if (result.ok) commit()
  return result
}

export async function financeConfirmSettlement(settlementId) {
  const confirmed = engine.confirmSettlement(store, { settlementId })
  if (!confirmed.ok) return confirmed
  const split = await splitToDealer({
    settlementId,
    dealerId: confirmed.settlement.dealerId,
    amountCny: confirmed.settlement.amountCny
  })
  confirmed.settlement.split = split
  commit()
  return { ...confirmed, split }
}

export function adminApproveLock(ticketId, decision) {
  const result = engine.approveLock(store, { ticketId, decision })
  if (result.ok && result.ticket.status === 'queued') {
    result.dispatch = queueLockCommand(result.ticket)
  }
  if (result.ok) commit()
  return result
}

export function adminQueueUnlock(ticketId) {
  const ticket = store.lockQueue.find((item) => item.id === ticketId)
  if (!ticket) return { ok: false, error: '锁定单不存在' }
  ticket.unlock = queueUnlockCommand(ticket)
  ticket.status = 'unlock_queued'
  commit()
  return { ok: true, ticket }
}

export function createArrearsLock(orderId) {
  const result = engine.proposeLock(store, { orderId, reason: '演示欠费' })
  if (result.ok) commit()
  return result
}

export { engine }
