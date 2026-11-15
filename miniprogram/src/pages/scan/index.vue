<template>
  <view class="page">
    <view class="hero">
      <view class="eyebrow">扫码桩</view>
      <view class="h1">{{ mode === 'deliver' ? '交付扫码登记' : '扫码进入商品' }}</view>
      <view class="muted">
        微信真机可接 scanCode。本期用模拟码：客户扫 SKU 进商城；经销商扫序列号绑定交付。
      </view>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">模拟商品码</view>
      <view v-for="sku in skus" :key="sku.id" class="method" @tap="enterSku(sku.id)">
        <view>{{ sku.name }}</view>
        <view class="muted">qr:sku:{{ sku.id }}</view>
      </view>
    </view>
    <view class="card">
      <button class="btn btn-ghost" @tap="tryNative">尝试调用摄像头扫码</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { SKUS } from '../../data/catalog.js'

const skus = SKUS
const mode = ref('order')
const presetId = ref('')

onLoad((query) => {
  mode.value = (query && query.mode) || 'order'
  presetId.value = (query && query.id) || ''
  if (presetId.value) enterSku(presetId.value)
})

function enterSku(id) {
  uni.redirectTo({ url: `/pages/mall/detail?id=${id}&source=scan` })
}

function tryNative() {
  uni.scanCode({
    success(res) {
      const raw = (res.result || '').replace('qr:sku:', '')
      const sku = SKUS.find((item) => item.id === raw || raw.indexOf(item.id) !== -1)
      if (sku) {
        enterSku(sku.id)
        return
      }
      uni.showToast({ title: '无法识别，请用模拟码', icon: 'none' })
    },
    fail() {
      uni.showToast({ title: '开发工具可点上面的模拟码', icon: 'none' })
    }
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
