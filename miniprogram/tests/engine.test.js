import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import * as engine from '../src/store/engine.js'
import * as huiju from '../src/api/huiju.js'
import * as device from '../src/api/device.js'

describe('phase 1 sales engine', () => {
  it('hides unapproved SKUs from customers', () => {
    const state = engine.seedState()
    const customerItems = engine.customerMallItems(state)
    assert.equal(
      customerItems.some((item) => item.id === 'trowel-36'),
      false
    )
    assert.equal(
      customerItems.some((item) => item.id === 'saw-20'),
      true
    )
  })

  it('allows three buy methods on bare machines only', () => {
    const bare = engine.methodsForSku('saw-20').map((item) => item.id)
    const trowel = engine.methodsForSku('trowel-24').map((item) => item.id)
    assert.deepEqual(bare, ['full', 'installment', 'rent'])
    assert.deepEqual(trowel, ['full'])
  })

  it('requires finance then admin before a listing is visible', () => {
    const state = engine.seedState()
    engine.login(state, 'sales')
    const submitted = engine.submitListingDraft(state, { skuId: 'trowel-24', priceCny: 88000 })
    assert.equal(submitted.listing.status, 'pending_finance')
    engine.login(state, 'finance')
    engine.reviewListing(state, { skuId: 'trowel-24', decision: 'approve', note: 'ok' })
    assert.equal(engine.listingOf(state, 'trowel-24').status, 'pending_admin')
    engine.login(state, 'admin')
    engine.reviewListing(state, { skuId: 'trowel-24', decision: 'approve', note: 'ok' })
    assert.equal(engine.listingOf(state, 'trowel-24').status, 'approved')
  })

  it('caps dealer stock display at two Full Pro sets', () => {
    const state = engine.seedState()
    const stock = engine.dealerStock(state, 'd-chengdu')
    assert.equal(stock.fullProSets, 1)
    assert.equal(stock.maxSets, 2)
    assert.ok(stock.serials.length > 0)
  })

  it('binds delivery scan then creates a settlement', () => {
    const state = engine.seedState()
    engine.login(state, 'customer')
    const placed = engine.placeOrder(state, {
      skuId: 'saw-20',
      method: 'installment',
      idUploaded: true,
      signed: true
    })
    assert.equal(placed.ok, true)
    engine.applyHuijuPayment(state, {
      orderId: placed.order.id,
      payment: { transactionId: 'mock', mock: true }
    })
    engine.login(state, 'dealer')
    const serial = state.dealers[0].serials.find((row) => row.skuId === 'saw-20').serial
    const delivered = engine.deliverByScan(state, {
      dealerId: 'd-chengdu',
      orderId: placed.order.id,
      serial
    })
    assert.equal(delivered.ok, true)
    assert.equal(delivered.order.status, 'delivered')
    assert.equal(state.settlements.length, 1)
  })

  it('queues lock commands without dispatching hardware', () => {
    const state = engine.seedState()
    engine.login(state, 'customer')
    const placed = engine.placeOrder(state, {
      skuId: 'saw-20',
      method: 'rent',
      idUploaded: true,
      signed: true
    })
    engine.applyHuijuPayment(state, { orderId: placed.order.id, payment: { mock: true } })
    const proposed = engine.proposeLock(state, { orderId: placed.order.id })
    engine.login(state, 'admin')
    const approved = engine.approveLock(state, {
      ticketId: proposed.ticket.id,
      decision: 'approve'
    })
    assert.equal(approved.ticket.status, 'queued')
    assert.equal(approved.ticket.command.dispatched, false)
    const queued = device.queueLockCommand(approved.ticket)
    assert.equal(queued.connected, false)
    assert.equal(queued.name, 'lock.command_queued')
  })

  it('huiju stays mock when merchant credentials are absent', async () => {
    const prepay = await huiju.createPayment({
      orderId: 'ord-1',
      amountCny: 0,
      subject: 'test',
      payer: 'u-customer'
    })
    assert.equal(prepay.mock, true)
    const split = await huiju.splitToDealer({
      settlementId: 'stl-1',
      dealerId: 'd-chengdu',
      amountCny: null
    })
    assert.equal(split.ok, false)
  })

  it('keeps identifiers unique after a simulated restart', () => {
    const state = engine.seedState()
    engine.login(state, 'customer')
    const first = engine.placeOrder(state, {
      skuId: 'saw-20',
      method: 'full',
      idUploaded: true,
      signed: true
    })
    const restored = engine.hydrateSeq(JSON.parse(JSON.stringify(state)))
    delete restored.seq
    engine.hydrateSeq(restored)
    engine.login(restored, 'customer')
    const second = engine.placeOrder(restored, {
      skuId: 'saw-20',
      method: 'full',
      idUploaded: true,
      signed: true
    })
    assert.equal(first.order.id, 'ord-1001')
    assert.notEqual(second.order.id, first.order.id)
    assert.equal(restored.orders.filter((item) => item.id === first.order.id).length, 1)
  })

  it('calculates settlement amount from the approved service fee', () => {
    const state = engine.seedState()
    engine.listingOf(state, 'saw-20').priceCny = 20000
    state.commercial.serviceFeeRatePercent = 8
    engine.login(state, 'customer')
    const placed = engine.placeOrder(state, {
      skuId: 'saw-20',
      method: 'full',
      idUploaded: true,
      signed: true
    })
    engine.applyHuijuPayment(state, {
      orderId: placed.order.id,
      payment: { mock: true }
    })
    engine.login(state, 'dealer')
    const delivered = engine.deliverByScan(state, {
      dealerId: 'd-chengdu',
      orderId: placed.order.id
    })
    assert.equal(delivered.settlement.amountCny, 1600)
  })

  it('delivers retail trowel orders from the company warehouse', () => {
    const state = engine.seedState()
    engine.login(state, 'customer')
    const placed = engine.placeOrder(state, {
      skuId: 'trowel-24',
      method: 'full',
      idUploaded: true,
      signed: true
    })
    engine.applyHuijuPayment(state, {
      orderId: placed.order.id,
      payment: { mock: true }
    })
    engine.login(state, 'dealer')
    const delivered = engine.deliverByScan(state, {
      dealerId: 'd-chengdu',
      orderId: placed.order.id
    })
    assert.equal(delivered.ok, true)
    assert.equal(delivered.order.delivery.from, 'company_warehouse')
    assert.equal(
      state.dealers[0].serials.every((row) => row.status === 'in_stock'),
      true
    )
  })

  it('keeps failed splits on pending_finance so finance can retry', () => {
    const state = engine.seedState()
    engine.login(state, 'customer')
    const placed = engine.placeOrder(state, {
      skuId: 'saw-20',
      method: 'full',
      idUploaded: true,
      signed: true
    })
    engine.applyHuijuPayment(state, {
      orderId: placed.order.id,
      payment: { mock: true }
    })
    engine.login(state, 'dealer')
    const delivered = engine.deliverByScan(state, {
      dealerId: 'd-chengdu',
      orderId: placed.order.id
    })
    engine.login(state, 'finance')
    const failed = engine.confirmSettlement(state, {
      settlementId: delivered.settlement.id,
      splitResult: { ok: false, error: '服务费金额未审批，不能分账' }
    })
    assert.equal(failed.ok, false)
    assert.equal(delivered.settlement.status, 'pending_finance')
    delivered.settlement.amountCny = 100
    const ok = engine.confirmSettlement(state, {
      settlementId: delivered.settlement.id,
      splitResult: { ok: true, mock: true }
    })
    assert.equal(ok.ok, true)
    assert.equal(ok.settlement.status, 'confirmed')
  })
})
