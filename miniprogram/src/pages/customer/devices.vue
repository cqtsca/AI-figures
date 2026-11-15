<template>
  <view class="page">
    <view class="hero">
      <view class="eyebrow">用户设备</view>
      <view class="h1">工况与位置</view>
      <view class="muted">一期未接入 4G/GNSS。页面有占位，事件接口返回空数据。</view>
    </view>
    <view v-if="!devices.length" class="card muted">交付扫码登记后，这里会出现已绑定设备。</view>
    <view v-for="device in devices" :key="device.serial" class="card">
      <view class="sku-name">{{ device.skuName }}</view>
      <view class="muted">序列号 {{ device.serial }}</view>
      <view class="row between spec"
        ><text>最后开机位置</text><text>{{ device.location.message }}</text></view
      >
      <view class="row between spec"
        ><text>工况</text><text>{{ device.telemetry.message }}</text></view
      >
      <view class="row between spec"
        ><text>故障</text><text>{{ device.fault.message }}</text></view
      >
    </view>
    <role-tabs active="设备" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import RoleTabs from '../../components/role-tabs.vue'
import { fault, lastPowerOnLocation, telemetry } from '../../api/device.js'
import { currentRole, store } from '../../store/index.js'

const devices = computed(() => {
  const user = currentRole()
  return store.orders
    .filter(
      (item) => item.delivery && (!user || user.role !== 'customer' || item.userId === user.id)
    )
    .map((item) => ({
      skuName: item.skuName,
      serial: item.delivery.serial,
      location: lastPowerOnLocation(),
      telemetry: telemetry(),
      fault: fault()
    }))
})
</script>

<style>
.sku-name {
  font-weight: 700;
}
.spec {
  margin-top: 12rpx;
}
</style>
