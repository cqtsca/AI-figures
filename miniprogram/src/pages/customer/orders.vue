<template>
  <view class="page">
    <view class="hero">
      <view class="eyebrow">我的订单</view>
      <view class="h1">订单与交付</view>
    </view>
    <view v-if="!orders.length" class="card muted">还没有订单。去商城点商品或扫码。</view>
    <view v-for="order in orders" :key="order.id" class="card">
      <view class="row between">
        <text class="sku-name">{{ order.skuName }}</text>
        <text class="chip">{{ statusText(order.status) }}</text>
      </view>
      <view class="muted">{{ order.methodName }} · {{ order.id }}</view>
      <view class="muted" v-if="order.delivery">已绑定序列号 {{ order.delivery.serial }}</view>
    </view>
    <role-tabs active="订单" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import RoleTabs from '../../components/role-tabs.vue'
import { currentRole, store } from '../../store/index.js'

const orders = computed(() => {
  const user = currentRole()
  if (!user) return []
  if (user.role === 'customer') return store.orders.filter((item) => item.userId === user.id)
  return store.orders
})

function statusText(status) {
  return { pending_pay: '待支付', paid: '已支付待交付', delivered: '已交付' }[status] || status
}
</script>

<style>
.sku-name {
  font-weight: 700;
}
</style>
