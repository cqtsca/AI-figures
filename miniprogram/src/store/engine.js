import { BUY_METHODS, FULL_PRO_COMPOSITION, ROLES, SKUS, skuById } from '../data/catalog.js'

const MAX_FULL_PRO_SETS = 2
let seq = 1000
const nextId = (prefix) => `${prefix}-${++seq}`

export { BUY_METHODS, FULL_PRO_COMPOSITION, MAX_FULL_PRO_SETS, ROLES, SKUS, skuById }

export function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function serialsForSet(setNo) {
  const stamp = String(setNo).padStart(2, '0')
  const items = []
  FULL_PRO_COMPOSITION.forEach((part) => {
    for (let i = 1; i <= part.qty; i += 1) {
      items.push({
        serial: `FP${stamp}-${part.skuId.toUpperCase()}-${String(i).padStart(2, '0')}`,
        skuId: part.skuId,
        status: 'in_stock'
      })
    }
  })
  return items
}

export function seedState() {
  const listings = SKUS.map((sku) => {
    const approved = sku.id !== 'trowel-36'
    return {
      skuId: sku.id,
      photoNote: '待销售上传实拍',
      specNote: sku.summary,
      priceCny: approved ? 0 : null,
      promoCny: null,
      promoNote: '',
      placeholderPrice: approved,
      status: approved ? 'approved' : 'pending_finance',
      history: approved
        ? [
            {
              at: '2026-11-01',
              actor: 'admin',
              action: 'approve',
              note: '演示占位价上架，非正式中国售价'
            }
          ]
        : [{ at: '2026-11-14', actor: 'sales', action: 'submit', note: '抹光机 36 英寸待审价' }]
    }
  })

  return {
    session: null,
    users: [
      { id: 'u-customer', role: 'customer', name: '王工（市政客户）', org: '演示市政项目部' },
      {
        id: 'u-dealer',
        role: 'dealer',
        name: '李店（成都经销商）',
        org: '成都演示经销商',
        dealerId: 'd-chengdu'
      },
      { id: 'u-sales', role: 'sales', name: '陈销售', org: '公司销售' },
      { id: 'u-finance', role: 'finance', name: '赵财务', org: '公司财务' },
      { id: 'u-admin', role: 'admin', name: '蒋成林（管理员）', org: '总经理/管理员' }
    ],
    listings,
    commercial: {
      status: 'approved',
      serviceFeeRatePercent: null,
      depositRatePercent: 30,
      powerInstallmentMonths: 12,
      powerInstallmentPerPeriodCny: null,
      powerRentPerPeriodCny: null,
      note: '服务费、租金、售价均未定死。下列数字仅为演示占位，改完须财务+管理员审批。',
      placeholder: true,
      history: [{ at: '2026-11-01', actor: 'admin', action: 'approve', note: '演示占位条款' }]
    },
    commercialDraft: null,
    dealers: [
      {
        id: 'd-chengdu',
        name: '成都演示经销商',
        city: '成都',
        depositStatus: 'recorded',
        depositRatePercent: 30,
        fullProSets: 1,
        serials: serialsForSet(1)
      }
    ],
    orders: [],
    settlements: [],
    arrears: [],
    lockQueue: [],
    qualifications: []
  }
}

export function listingOf(state, skuId) {
  return state.listings.find((item) => item.skuId === skuId) || null
}

export function mallItems(state) {
  return SKUS.map((sku) => {
    const listing = listingOf(state, sku.id)
    return {
      ...sku,
      listing,
      visibleToCustomer: listing && listing.status === 'approved'
    }
  })
}

export function customerMallItems(state) {
  return mallItems(state).filter((item) => item.visibleToCustomer)
}

export function login(state, role) {
  const user = state.users.find((item) => item.role === role)
  if (!user) return { ok: false, error: '未知角色' }
  state.session = { ...user }
  return { ok: true, user: state.session }
}

export function logout(state) {
  state.session = null
  return { ok: true }
}

export function requireRole(state, roles) {
  if (!state.session) return { ok: false, error: '未登录' }
  if (roles && !roles.includes(state.session.role)) {
    return { ok: false, error: '无权访问' }
  }
  return { ok: true, user: state.session }
}

export function methodsForSku(skuId) {
  const sku = skuById(skuId)
  if (!sku) return []
  return BUY_METHODS.filter((method) => sku.buyMethods.includes(method.id))
}

function powerLine(state, method) {
  const { commercial } = state
  if (method === 'full') {
    return {
      title: '电源随全款支付',
      amountCny: commercial.placeholder ? 0 : commercial.powerInstallmentPerPeriodCny
    }
  }
  if (method === 'installment') {
    return {
      title: `电源分期（${commercial.powerInstallmentMonths} 期）`,
      amountCny: commercial.powerInstallmentPerPeriodCny,
      schedule: '首期现付，其余按计划记账'
    }
  }
  return {
    title: '电源租赁（首期租金）',
    amountCny: commercial.powerRentPerPeriodCny,
    schedule: '所有权在公司'
  }
}

export function quoteOrder(state, { skuId, method }) {
  const sku = skuById(skuId)
  const listing = listingOf(state, skuId)
  if (!sku || !listing) return { ok: false, error: '商品不存在' }
  if (listing.status !== 'approved') return { ok: false, error: '商品未过审，客户不可下单' }
  if (!sku.buyMethods.includes(method)) return { ok: false, error: '该 SKU 不支持此购买方式' }
  const machineAmount = listing.promoCny != null ? listing.promoCny : listing.priceCny
  const power = powerLine(state, method)
  const dueNow = method === 'full' ? machineAmount : (machineAmount || 0) + (power.amountCny || 0)
  return {
    ok: true,
    quote: {
      skuId,
      skuName: sku.name,
      kind: sku.kind,
      method,
      methodName: BUY_METHODS.find((item) => item.id === method).name,
      machineAmount,
      placeholderPrice: listing.placeholderPrice,
      promoNote: listing.promoNote,
      power,
      dueNow,
      lockEligible: method !== 'full' && sku.kind !== 'trowel'
    }
  }
}

export function placeOrder(state, payload) {
  const auth = requireRole(state, ['customer', 'dealer'])
  if (!auth.ok) return auth
  const quoted = quoteOrder(state, payload)
  if (!quoted.ok) return quoted
  if (!payload.idUploaded || !payload.signed) {
    return { ok: false, error: '请先完成资质上传与协议签字' }
  }
  const order = {
    id: nextId('ord'),
    userId: auth.user.id,
    role: auth.user.role,
    dealerId: payload.dealerId || (auth.user.dealerId ? auth.user.dealerId : 'd-chengdu'),
    source: payload.source || 'tap',
    channel: auth.user.role === 'dealer' ? 'tender' : 'retail',
    status: 'pending_pay',
    createdAt: new Date().toISOString(),
    qualification: {
      idType: payload.orgLicense ? 'company' : 'person',
      idUploaded: true,
      orgLicense: !!payload.orgLicense,
      signed: true
    },
    ...quoted.quote,
    payment: null,
    delivery: null
  }
  state.orders.unshift(order)
  state.qualifications.unshift({ orderId: order.id, ...order.qualification })
  return { ok: true, order }
}

export function applyHuijuPayment(state, { orderId, payment }) {
  const order = state.orders.find((item) => item.id === orderId)
  if (!order) return { ok: false, error: '订单不存在' }
  if (order.status !== 'pending_pay') return { ok: false, error: '订单状态不可支付' }
  order.payment = payment
  order.status = 'paid'
  return { ok: true, order }
}

export function submitListingDraft(state, patch) {
  const auth = requireRole(state, ['sales'])
  if (!auth.ok) return auth
  const listing = listingOf(state, patch.skuId)
  if (!listing) return { ok: false, error: 'SKU 不存在' }
  listing.photoNote = patch.photoNote ?? listing.photoNote
  listing.specNote = patch.specNote ?? listing.specNote
  listing.priceCny = patch.priceCny === '' || patch.priceCny == null ? null : Number(patch.priceCny)
  listing.promoCny = patch.promoCny === '' || patch.promoCny == null ? null : Number(patch.promoCny)
  listing.promoNote = patch.promoNote ?? listing.promoNote
  listing.placeholderPrice = false
  listing.status = 'pending_finance'
  listing.history.unshift({
    at: new Date().toISOString(),
    actor: 'sales',
    action: 'submit',
    note: patch.note || '销售提交上架草稿'
  })
  return { ok: true, listing }
}

export function reviewListing(state, { skuId, decision, note }) {
  const listing = listingOf(state, skuId)
  if (!listing) return { ok: false, error: 'SKU 不存在' }
  const role = state.session && state.session.role
  if (listing.status === 'pending_finance') {
    const auth = requireRole(state, ['finance'])
    if (!auth.ok) return auth
    listing.status = decision === 'approve' ? 'pending_admin' : 'draft'
    listing.history.unshift({ at: new Date().toISOString(), actor: role, action: decision, note })
    return { ok: true, listing }
  }
  if (listing.status === 'pending_admin') {
    const auth = requireRole(state, ['admin'])
    if (!auth.ok) return auth
    listing.status = decision === 'approve' ? 'approved' : 'draft'
    listing.history.unshift({ at: new Date().toISOString(), actor: role, action: decision, note })
    return { ok: true, listing }
  }
  return { ok: false, error: '当前状态不可审批' }
}

export function submitCommercialDraft(state, patch) {
  const auth = requireRole(state, ['sales', 'finance'])
  if (!auth.ok) return auth
  state.commercialDraft = {
    ...state.commercial,
    ...patch,
    status: 'pending_finance',
    placeholder: false,
    submittedBy: auth.user.role
  }
  if (auth.user.role === 'finance') {
    state.commercialDraft.status = 'pending_admin'
  }
  return { ok: true, draft: state.commercialDraft }
}

export function reviewCommercial(state, { decision, note }) {
  const draft = state.commercialDraft
  if (!draft) return { ok: false, error: '没有待审条款' }
  const role = state.session && state.session.role
  if (draft.status === 'pending_finance') {
    const auth = requireRole(state, ['finance'])
    if (!auth.ok) return auth
    draft.status = decision === 'approve' ? 'pending_admin' : 'draft'
    draft.history.unshift({ at: new Date().toISOString(), actor: role, action: decision, note })
    if (decision !== 'approve') state.commercialDraft = null
    return { ok: true, draft }
  }
  if (draft.status === 'pending_admin') {
    const auth = requireRole(state, ['admin'])
    if (!auth.ok) return auth
    if (decision === 'approve') {
      state.commercial = {
        ...draft,
        status: 'approved',
        history: [
          { at: new Date().toISOString(), actor: role, action: 'approve', note },
          ...draft.history
        ]
      }
      state.commercialDraft = null
      return { ok: true, commercial: state.commercial }
    }
    state.commercialDraft = null
    return { ok: true, rejected: true }
  }
  return { ok: false, error: '当前状态不可审批' }
}

export function dealerStock(state, dealerId) {
  const dealer = state.dealers.find((item) => item.id === dealerId)
  if (!dealer) return null
  const inStock = dealer.serials.filter((item) => item.status === 'in_stock')
  return {
    ...dealer,
    maxSets: MAX_FULL_PRO_SETS,
    inStockCount: inStock.length,
    deliveredCount: dealer.serials.filter((item) => item.status === 'delivered').length
  }
}

export function deliverByScan(state, { dealerId, orderId, serial }) {
  const auth = requireRole(state, ['dealer', 'sales'])
  if (!auth.ok) return auth
  const dealer = state.dealers.find((item) => item.id === dealerId)
  const order = state.orders.find((item) => item.id === orderId)
  if (!dealer || !order) return { ok: false, error: '经销商或订单不存在' }
  if (order.status !== 'paid') return { ok: false, error: '仅已支付订单可交付' }
  if (order.channel === 'tender') {
    order.delivery = {
      serial: serial || `WH-${order.skuId}-${Date.now()}`,
      at: new Date().toISOString(),
      from: 'company_warehouse',
      stub: !serial
    }
  } else {
    const item = dealer.serials.find(
      (row) => row.serial === serial && row.skuId === order.skuId && row.status === 'in_stock'
    )
    if (!item) return { ok: false, error: '库存中没有该序列号，或与订单 SKU 不符' }
    item.status = 'delivered'
    item.orderId = order.id
    order.delivery = {
      serial: item.serial,
      at: new Date().toISOString(),
      from: 'dealer_stock',
      stub: false
    }
  }
  order.status = 'delivered'
  const settlement = {
    id: nextId('stl'),
    orderId: order.id,
    dealerId,
    type: 'service_fee',
    amountCny: state.commercial.serviceFeeRatePercent == null ? null : 0,
    status: 'pending_finance',
    note: '交付扫码后出分账单，财务确认后才分账。金额来自已审批服务费。'
  }
  state.settlements.unshift(settlement)
  if (order.lockEligible) {
    state.arrears.push({
      id: nextId('arr'),
      orderId: order.id,
      status: 'clear',
      note: '分期/租赁台账已建，尚无欠费'
    })
  }
  return { ok: true, order, settlement }
}

export function confirmSettlement(state, { settlementId }) {
  const auth = requireRole(state, ['finance'])
  if (!auth.ok) return auth
  const row = state.settlements.find((item) => item.id === settlementId)
  if (!row) return { ok: false, error: '结算单不存在' }
  row.status = 'confirmed'
  row.confirmedAt = new Date().toISOString()
  return { ok: true, settlement: row }
}

export function proposeLock(state, { orderId, reason }) {
  const order = state.orders.find((item) => item.id === orderId)
  if (!order) return { ok: false, error: '订单不存在' }
  if (!order.lockEligible) return { ok: false, error: '全款电源不锁机' }
  const ticket = {
    id: nextId('lock'),
    orderId,
    reason: reason || '欠费',
    status: 'proposed',
    command: null
  }
  state.lockQueue.unshift(ticket)
  return { ok: true, ticket }
}

export function approveLock(state, { ticketId, decision }) {
  const auth = requireRole(state, ['admin'])
  if (!auth.ok) return auth
  const ticket = state.lockQueue.find((item) => item.id === ticketId)
  if (!ticket) return { ok: false, error: '锁定单不存在' }
  if (decision !== 'approve') {
    ticket.status = 'rejected'
    return { ok: true, ticket }
  }
  ticket.status = 'queued'
  ticket.command = {
    type: 'lock.command_queued',
    dispatched: false,
    note: '一期命令只入队，不发硬件'
  }
  return { ok: true, ticket }
}

export function pendingListings(state, stage) {
  if (stage === 'finance') return state.listings.filter((item) => item.status === 'pending_finance')
  if (stage === 'admin') return state.listings.filter((item) => item.status === 'pending_admin')
  return state.listings.filter((item) => item.status !== 'approved')
}
