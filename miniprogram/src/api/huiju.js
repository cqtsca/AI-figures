/**
 * 汇聚支付：收款 + 分账。
 * 本期没有商户凭证，默认走 mock。接入后把 mock 关掉并填写商户号。
 */

export const huijuConfig = {
  provider: 'huiju',
  mock: true,
  merchantNo: '',
  splitEnabled: true
}

function assertConfiguredForLive() {
  if (!huijuConfig.mock && !huijuConfig.merchantNo) {
    return { ok: false, error: '缺少汇聚商户号，无法走真实支付' }
  }
  return { ok: true }
}

export async function createPayment({ orderId, amountCny, subject, payer }) {
  const ready = assertConfiguredForLive()
  if (!ready.ok) return ready
  if (huijuConfig.mock) {
    return {
      ok: true,
      mock: true,
      prepayId: `mock-prepay-${orderId}`,
      amountCny,
      subject,
      payer,
      channel: 'huiju_mock'
    }
  }
  return { ok: false, error: '真实汇聚下单未接入' }
}

export async function mockPaySuccess(prepay) {
  return {
    ok: true,
    mock: true,
    transactionId: `mock-txn-${Date.now()}`,
    prepayId: prepay.prepayId,
    paidAt: new Date().toISOString(),
    notify: 'simulated_notify'
  }
}

export async function handleNotify(payload) {
  return { ok: true, mock: huijuConfig.mock, payload }
}

export async function splitToDealer({ settlementId, dealerId, amountCny }) {
  const ready = assertConfiguredForLive()
  if (!ready.ok) return ready
  if (amountCny == null) {
    return { ok: false, error: '服务费金额未审批，不能分账' }
  }
  if (huijuConfig.mock) {
    return {
      ok: true,
      mock: true,
      splitId: `mock-split-${settlementId}`,
      dealerId,
      amountCny,
      status: 'mock_success'
    }
  }
  return { ok: false, error: '真实汇聚分账未接入' }
}
