<template>
  <view class="page">
    <view class="hero">
      <view class="eyebrow">经销商 · 一层渠道</view>
      <view class="h1">{{ stock ? stock.name : '经销商' }}</view>
      <view class="muted"
        >铺货上限 1～2 套 Full Pro。保证金每年一次、比例 30%（货值口径待确认）。</view
      >
    </view>
    <view class="card" v-if="stock">
      <view class="row between">
        <text>当前铺货</text>
        <text class="h1" style="font-size: 36rpx"
          >{{ stock.fullProSets }} / {{ stock.maxSets }} 套</text
        >
      </view>
      <view class="muted"
        >保证金状态：{{
          stock.depositStatus === 'recorded' ? '财务已入账（演示）' : stock.depositStatus
        }}</view
      >
    </view>
    <view class="card">
      <view class="row between">
        <view class="h1" style="font-size: 32rpx">库存序列号</view>
        <text class="muted" v-if="stock"
          >在库 {{ stock.inStockCount }} · 已交付 {{ stock.deliveredCount }}</text
        >
      </view>
      <view v-for="row in visibleSerials" :key="row.serial" class="row between spec">
        <text>{{ row.serial }}</text>
        <text class="chip" :class="row.status === 'in_stock' ? '' : 'chip-warn'">
          {{ row.status === 'in_stock' ? '在库' : '已交付' }}
        </text>
      </view>
      <button
        v-if="stock && stock.serials.length > 4"
        class="btn btn-ghost"
        size="mini"
        @tap="toggleSerials"
      >
        {{ showAllSerials ? '收起' : '展开全部序列号' }}
      </button>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">待交付订单</view>
      <view v-if="!paidOrders.length" class="muted">没有已支付待交付订单。</view>
      <view v-for="order in paidOrders" :key="order.id" class="method">
        <view>{{ order.skuName }} · {{ order.id }}</view>
        <button class="btn btn-accent" size="mini" @tap="deliver(order)">模拟交付扫码</button>
      </view>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">本店结算</view>
      <view v-if="!settlements.length" class="muted">交付登记后才会出分账单。</view>
      <view v-for="row in settlements" :key="row.id" class="row between spec">
        <text>{{ row.id }}</text>
        <text>{{ settlementStatus(row) }}</text>
      </view>
    </view>
    <button class="btn btn-ghost" @tap="goLogin">切换角色</button>
    <role-tabs active="经营" />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import RoleTabs from '../../components/role-tabs.vue'
import { currentRole, scanDeliver, store } from '../../store/index.js'
import { dealerStock, usesCompanyWarehouse } from '../../store/engine.js'

const dealerId = computed(() => {
  const user = currentRole()
  return (user && user.dealerId) || 'd-chengdu'
})
const stock = computed(() => dealerStock(store, dealerId.value))
const paidOrders = computed(() =>
  store.orders.filter((item) => item.dealerId === dealerId.value && item.status === 'paid')
)
const settlements = computed(() =>
  store.settlements.filter((item) => item.dealerId === dealerId.value)
)
const showAllSerials = ref(false)
const visibleSerials = computed(() => {
  const rows = (stock.value && stock.value.serials) || []
  return showAllSerials.value ? rows : rows.slice(0, 4)
})

function toggleSerials() {
  showAllSerials.value = !showAllSerials.value
}

function goLogin() {
  uni.redirectTo({ url: '/pages/login/login' })
}

function settlementStatus(row) {
  if (row.status === 'confirmed') return '财务已确认'
  if (row.amountCny == null) return '待审服务费金额'
  return '待财务确认'
}

function deliver(order) {
  const candidate =
    stock.value &&
    stock.value.serials.find((row) => row.skuId === order.skuId && row.status === 'in_stock')
  const warehouse = usesCompanyWarehouse(order)
  if (!candidate && !warehouse) {
    uni.showToast({ title: '该 SKU 铺货库存不足', icon: 'none' })
    return
  }
  const result = scanDeliver({
    dealerId: dealerId.value,
    orderId: order.id,
    serial: candidate ? candidate.serial : ''
  })
  uni.showToast({
    title: result.ok ? '已登记交付' : result.error,
    icon: result.ok ? 'success' : 'none'
  })
}
</script>

<style>
.spec {
  padding: 12rpx 0;
}
.method {
  margin-top: 16rpx;
  padding: 16rpx;
  background: #f4f6f5;
  border-radius: 16rpx;
}
</style>
