<template>
  <view class="page">
    <view class="hero">
      <view class="eyebrow">管理员 / 总经理</view>
      <view class="h1">终审与锁机队列</view>
      <view class="muted">一期只批单、命令入队，不发硬件。设备通信后台是空表入口。</view>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">上架终审</view>
      <view v-if="!listings.length" class="muted">没有待终审商品。</view>
      <view v-for="row in listings" :key="row.skuId" class="method">
        <view>{{ nameOf(row.skuId) }} · {{ formatCny(row.priceCny, row.placeholderPrice) }}</view>
        <button class="btn btn-accent" size="mini" @tap="decide(row.skuId, 'approve')">
          终审上架
        </button>
        <button class="btn btn-ghost" size="mini" @tap="decide(row.skuId, 'reject')">退回</button>
      </view>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">条款终审</view>
      <view v-if="!needCommercial" class="muted">没有待终审服务费/租金。</view>
      <button v-else class="btn btn-accent" @tap="decideFee('approve')">批准条款生效</button>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">锁定审批（命令只入队）</view>
      <button class="btn btn-warn" size="mini" @tap="demoLock">对最近分期/租赁单提议锁定</button>
      <view v-for="ticket in store.lockQueue" :key="ticket.id" class="method">
        <view>{{ ticket.id }} · {{ ticket.status }}</view>
        <view class="muted">{{ ticket.command ? ticket.command.note : '待批准' }}</view>
        <button
          v-if="ticket.status === 'proposed'"
          class="btn btn-accent"
          size="mini"
          @tap="approve(ticket.id)"
        >
          批准入队
        </button>
      </view>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">设备通信（预留）</view>
      <view class="muted">{{ deviceStatus.message }}</view>
      <view class="muted"
        >事件：boot_check / job_finished / telemetry / fault / last_power_on_location</view
      >
    </view>
    <button class="btn btn-ghost" @tap="goLogin">切换角色</button>
    <role-tabs active="审批" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import RoleTabs from '../../components/role-tabs.vue'
import { telemetry } from '../../api/device.js'
import { skuById } from '../../data/catalog.js'
import {
  adminApproveLock,
  createArrearsLock,
  decideCommercial,
  decideListing,
  formatCny,
  store
} from '../../store/index.js'
import { pendingListings } from '../../store/engine.js'

const listings = computed(() => pendingListings(store, 'admin'))
const needCommercial = computed(
  () => store.commercialDraft && store.commercialDraft.status === 'pending_admin'
)
const deviceStatus = telemetry()

function goLogin() {
  uni.redirectTo({ url: '/pages/login/login' })
}

function nameOf(id) {
  const sku = skuById(id)
  return sku ? sku.name : id
}

function decide(skuId, decision) {
  const result = decideListing({ skuId, decision, note: '管理员终审' })
  uni.showToast({
    title: result.ok ? '已处理' : result.error,
    icon: result.ok ? 'success' : 'none'
  })
}

function decideFee(decision) {
  const result = decideCommercial({ decision, note: '管理员终审条款' })
  uni.showToast({
    title: result.ok ? '已生效' : result.error,
    icon: result.ok ? 'success' : 'none'
  })
}

function demoLock() {
  const order = store.orders.find((item) => item.lockEligible)
  if (!order) {
    uni.showToast({ title: '没有分期/租赁订单', icon: 'none' })
    return
  }
  const result = createArrearsLock(order.id)
  uni.showToast({ title: result.ok ? '已提议锁定' : result.error, icon: 'none' })
}

function approve(id) {
  const result = adminApproveLock(id, 'approve')
  uni.showToast({ title: result.ok ? '已入队，未发硬件' : result.error, icon: 'none' })
}
</script>

<style>
.method {
  margin-top: 16rpx;
  padding: 16rpx;
  background: #f4f6f5;
  border-radius: 16rpx;
}
</style>
