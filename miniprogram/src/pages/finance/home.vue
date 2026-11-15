<template>
  <view class="page">
    <view class="hero">
      <view class="eyebrow">财务</view>
      <view class="h1">审价、收款、分账</view>
      <view class="muted">财务不改规格。价格与促销复核后交给管理员终审。分账须财务确认。</view>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">待审上架</view>
      <view v-if="!listings.length" class="muted">没有待财务审价的商品。</view>
      <view v-for="row in listings" :key="row.skuId" class="method">
        <view>{{ nameOf(row.skuId) }} · {{ formatCny(row.priceCny, row.placeholderPrice) }}</view>
        <view class="row">
          <button class="btn btn-accent" size="mini" @tap="decide(row.skuId, 'approve')">
            通过
          </button>
          <button class="btn btn-ghost" size="mini" @tap="decide(row.skuId, 'reject')">退回</button>
        </view>
      </view>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">待审条款</view>
      <view v-if="!needCommercial" class="muted">没有待财务确认的服务费/租金。</view>
      <view v-else>
        <view
          >服务费 {{ draft.serviceFeeRatePercent }}% · 租金 {{ draft.powerRentPerPeriodCny }}</view
        >
        <button class="btn btn-accent" @tap="decideFee('approve')">确认并送终审</button>
      </view>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">结算单</view>
      <view v-for="row in store.settlements" :key="row.id" class="method">
        <view>{{ row.id }} · {{ row.status }}</view>
        <view class="muted">{{ row.note }}</view>
        <button
          v-if="row.status === 'pending_finance'"
          class="btn btn-accent"
          size="mini"
          @tap="confirm(row.id)"
        >
          确认分账（模拟汇聚）
        </button>
      </view>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">已支付订单</view>
      <view v-for="order in paid" :key="order.id" class="muted">
        {{ order.id }} {{ order.skuName }} · {{ order.payment && order.payment.transactionId }}
      </view>
    </view>
    <button class="btn btn-ghost" @tap="goLogin">切换角色</button>
    <role-tabs active="财务" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import RoleTabs from '../../components/role-tabs.vue'
import { skuById } from '../../data/catalog.js'
import {
  decideCommercial,
  decideListing,
  financeConfirmSettlement,
  formatCny,
  store
} from '../../store/index.js'
import { pendingListings } from '../../store/engine.js'

const listings = computed(() => pendingListings(store, 'finance'))
const draft = computed(() => store.commercialDraft)
const needCommercial = computed(() => draft.value && draft.value.status === 'pending_finance')
const paid = computed(() => store.orders.filter((item) => item.status !== 'pending_pay'))

function goLogin() {
  uni.redirectTo({ url: '/pages/login/login' })
}

function nameOf(id) {
  const sku = skuById(id)
  return sku ? sku.name : id
}

function decide(skuId, decision) {
  const result = decideListing({ skuId, decision, note: '财务审价' })
  uni.showToast({
    title: result.ok ? '已处理' : result.error,
    icon: result.ok ? 'success' : 'none'
  })
}

function decideFee(decision) {
  const result = decideCommercial({ decision, note: '财务确认条款' })
  uni.showToast({
    title: result.ok ? '已处理' : result.error,
    icon: result.ok ? 'success' : 'none'
  })
}

async function confirm(id) {
  const result = await financeConfirmSettlement(id)
  uni.showToast({
    title: result.ok
      ? result.split && result.split.ok
        ? '已模拟分账'
        : result.split.error
      : result.error,
    icon: 'none'
  })
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
