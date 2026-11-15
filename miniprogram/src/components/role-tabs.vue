<template>
  <view class="tabs">
    <view
      v-for="item in items"
      :key="item.url"
      class="tab"
      :class="{ on: item.on }"
      @tap="go(item.url)"
    >
      <text class="tab-label">{{ item.label }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { currentRole } from '../store/index.js'

const props = defineProps({
  active: { type: String, default: '' }
})

const maps = {
  customer: [
    { label: '商城', url: '/pages/mall/index' },
    { label: '订单', url: '/pages/customer/orders' },
    { label: '设备', url: '/pages/customer/devices' },
    { label: '我的', url: '/pages/customer/home' }
  ],
  dealer: [
    { label: '经营', url: '/pages/dealer/home' },
    { label: '商城', url: '/pages/mall/index' },
    { label: '扫码', url: '/pages/scan/index' }
  ],
  sales: [
    { label: '工作台', url: '/pages/sales/home' },
    { label: '商城', url: '/pages/mall/index' }
  ],
  finance: [
    { label: '财务', url: '/pages/finance/home' },
    { label: '商城', url: '/pages/mall/index' }
  ],
  admin: [
    { label: '审批', url: '/pages/admin/home' },
    { label: '商城', url: '/pages/mall/index' }
  ]
}

const items = computed(() => {
  const role = currentRole()
  const list = (role && maps[role.role]) || []
  return list.map((item) => ({
    ...item,
    on: props.active === item.url || props.active === item.label
  }))
})

function go(url) {
  uni.redirectTo({ url })
}
</script>

<style>
.tabs {
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: 24rpx;
  background: #10243a;
  border-radius: 999rpx;
  display: flex;
  padding: 8rpx;
  z-index: 20;
}
.tab {
  flex: 1;
  text-align: center;
  color: rgba(255, 255, 255, 0.62);
  padding: 18rpx 0;
  border-radius: 999rpx;
}
.tab.on {
  background: #1f7a63;
  color: #fff;
}
.tab-label {
  font-size: 24rpx;
}

/* #ifdef H5 */
.tabs {
  width: 342px;
  max-width: calc(100% - 48px);
  left: 50%;
  right: auto;
  transform: translateX(-50%);
}
/* #endif */
</style>
