/**
 * 二期设备通信预留接口。一期只记账、入队，不设计 BMS / 4G 协议，不发硬件令。
 */

export const DEVICE_EVENTS = [
  'device.boot_check',
  'device.job_finished',
  'device.telemetry',
  'device.fault',
  'device.last_power_on_location'
]

export const DEVICE_COMMANDS = [
  'lock.propose',
  'lock.approve',
  'lock.command_queued',
  'unlock.command_queued'
]

const empty = (name, extra = {}) => ({
  ok: true,
  phase: 1,
  connected: false,
  name,
  data: extra.data || null,
  message: extra.message || '一期未接入设备通信'
})

export function onPaymentArrears(payload) {
  return empty('payment.arrears', { data: payload, message: '欠费已记账，一期不锁机' })
}

export function onPaymentCleared(payload) {
  return empty('payment.cleared', { data: payload, message: '清欠已记账' })
}

export function onDeviceEvent(eventName, payload) {
  if (!DEVICE_EVENTS.includes(eventName)) {
    return { ok: false, error: `未知设备事件: ${eventName}` }
  }
  return empty(eventName, { data: payload, message: '未接入，返回空数据' })
}

export function bootCheck() {
  return empty('device.boot_check', { message: '未接入，不拦截开机' })
}

export function jobFinished() {
  return empty('device.job_finished')
}

export function telemetry() {
  return empty('device.telemetry')
}

export function fault() {
  return empty('device.fault')
}

export function lastPowerOnLocation() {
  return empty('device.last_power_on_location')
}

export function queueLockCommand(ticket) {
  return empty('lock.command_queued', {
    data: { ticketId: ticket && ticket.id, dispatched: false },
    message: '命令已入队，一期不发硬件'
  })
}

export function queueUnlockCommand(ticket) {
  return empty('unlock.command_queued', {
    data: { ticketId: ticket && ticket.id, dispatched: false },
    message: '解锁令已入队，一期不发硬件'
  })
}
