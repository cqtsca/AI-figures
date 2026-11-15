<template>
  <view class="page" v-if="sku">
    <view class="hero">
      <view class="row">
        <view class="mark" :style="{ background: sku.color }">{{ sku.mark }}</view>
        <view style="margin-left: 20rpx; flex: 1">
          <view class="eyebrow">{{ sku.group }}</view>
          <view class="h1">{{ sku.name }}</view>
          <view class="muted">{{ sku.en }}</view>
        </view>
      </view>
      <view style="margin-top: 20rpx">{{ sku.summary }}</view>
      <view class="price">{{ priceText }}</view>
      <view class="muted" v-if="listing && listing.placeholderPrice"
        >中国售价未定，此为演示占位，非正式报价。</view
      >
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">参数</view>
      <view v-for="spec in sku.specs" :key="spec.label" class="row between spec">
        <text class="muted">{{ spec.label }}</text>
        <text>{{ spec.value }}</text>
      </view>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">购买方式</view>
      <view
        v-for="method in methods"
        :key="method.id"
        class="method"
        :class="{ on: chosen === method.id }"
        @tap="chosen = method.id"
      >
        <view class="row between">
          <text class="sku-name">{{ method.name }}</text>
          <text class="chip">{{ method.short }}</text>
        </view>
        <view class="muted">{{ method.desc }}</view>
      </view>
      <view class="muted" v-if="sku.kind === 'trowel'"
        >抹光机是否同样拆电源分期/租赁尚未拍板，一期只开放全款。</view
      >
    </view>
    <button class="btn btn-accent" :disabled="!canBuy" @tap="buy">点此下单</button>
    <button class="btn btn-ghost" @tap="goScan">模拟扫码进入本 SKU</button>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { currentRole, formatCny, store } from '../../store/index.js'
import { methodsForSku, skuById, listingOf } from '../../store/engine.js'

const skuId = ref('')
const chosen = ref('full')
const sku = computed(() => skuById(skuId.value))
const listing = computed(() => listingOf(store, skuId.value))
const methods = computed(() => methodsForSku(skuId.value))
const priceText = computed(() =>
  formatCny(
    listing.value &&
      (listing.value.promoCny != null ? listing.value.promoCny : listing.value.priceCny),
    listing.value && listing.value.placeholderPrice
  )
)
const canBuy = computed(() => {
  const session = currentRole()
  return (
    session &&
    ['customer', 'dealer'].includes(session.role) &&
    listing.value &&
    listing.value.status === 'approved'
  )
})

onLoad((query) => {
  skuId.value = (query && query.id) || ''
  if (query && query.method) chosen.value = query.method
})

function buy() {
  if (!canBuy.value) {
    uni.showToast({ title: '请用客户或经销商登录，且商品须已上架', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/pages/mall/order?id=${skuId.value}&method=${chosen.value}&source=tap`
  })
}

function goScan() {
  uni.navigateTo({ url: `/pages/scan/index?mode=order&id=${skuId.value}` })
}
</script>

<style>
.price {
  margin-top: 16rpx;
  color: #1f7a63;
  font-size: 36rpx;
  font-weight: 700;
}
.spec {
  padding: 14rpx 0;
  border-bottom: 1rpx solid #eef2f0;
}
.method {
  margin-top: 16rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  background: #f4f6f5;
}
.method.on {
  background: #e4f3ee;
  outline: 2rpx solid #1f7a63;
}
.sku-name {
  font-weight: 700;
}
</style>
