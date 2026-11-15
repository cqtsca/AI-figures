<template>
  <view class="page">
    <view class="hero">
      <view class="row between">
        <view>
          <view class="eyebrow">TSEMODUX Full Pro + 抹光机</view>
          <view class="h1">商城</view>
        </view>
        <button class="btn btn-accent scan-btn" size="mini" @tap="goScan">扫码下单</button>
      </view>
      <view class="muted" style="margin-top: 12rpx"
        >点商品或扫经销商/设备上的码。市政设备不到店安装。</view
      >
    </view>
    <view v-for="item in items" :key="item.id" class="card sku" @tap="open(item)">
      <view class="row">
        <view class="mark" :style="{ background: item.color }">{{ item.mark }}</view>
        <view class="sku-body">
          <view class="sku-name">{{ item.name }}</view>
          <view class="row between" style="margin-top: 8rpx">
            <text class="muted">{{ item.group }}</text>
            <text class="chip" :class="item.visibleToCustomer ? '' : 'chip-warn'">
              {{ item.visibleToCustomer ? '已上架' : listingStatusLabel(item.listing.status) }}
            </text>
          </view>
          <view class="muted">{{ item.en }}</view>
          <view class="price">{{ priceText(item) }}</view>
        </view>
      </view>
    </view>
    <role-tabs active="商城" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import RoleTabs from '../../components/role-tabs.vue'
import { formatCny, listingStatusLabel, mallForViewer } from '../../store/index.js'

const items = computed(() => mallForViewer())

function priceText(item) {
  if (!item.listing || item.listing.status !== 'approved') return '未过审，客户不可见'
  return formatCny(
    item.listing.promoCny != null ? item.listing.promoCny : item.listing.priceCny,
    item.listing.placeholderPrice
  )
}

function open(item) {
  uni.navigateTo({ url: `/pages/mall/detail?id=${item.id}` })
}

function goScan() {
  uni.navigateTo({ url: '/pages/scan/index?mode=order' })
}
</script>

<style>
.scan-btn {
  margin: 0;
}
.sku-body {
  margin-left: 20rpx;
  flex: 1;
}
.sku-name {
  font-weight: 700;
  font-size: 30rpx;
  line-height: 1.35;
  white-space: normal;
}
.price {
  margin-top: 8rpx;
  color: #1f7a63;
  font-weight: 700;
}
</style>
