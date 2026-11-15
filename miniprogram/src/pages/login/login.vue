<template>
  <view class="page login">
    <view class="hero">
      <view class="eyebrow">一期 · 销售系统</view>
      <view class="h1">市政锂电设备商城</view>
      <view class="muted" style="margin-top: 12rpx">
        微信小程序 / 后续可出 App。开发环境用角色模拟登录，不接微信授权。
      </view>
    </view>
    <view v-for="role in roles" :key="role.id" class="card role" @tap="enter(role.id)">
      <view class="row between">
        <view>
          <view class="role-name">{{ role.label }}</view>
          <view class="muted">{{ role.blurb }}</view>
        </view>
        <text class="chip">进入</text>
      </view>
    </view>
    <view class="muted" style="padding: 8rpx 8rpx 40rpx">
      不实现远程锁机与 BMS。设备事件与指令只留空接口。页稿不在本仓库重建。
    </view>
  </view>
</template>

<script setup>
import { ROLES } from '../../data/catalog.js'
import { loginAs } from '../../store/index.js'

const roles = ROLES

function enter(role) {
  const result = loginAs(role)
  if (!result.ok) {
    uni.showToast({ title: result.error, icon: 'none' })
    return
  }
  const target = ROLES.find((item) => item.id === role)
  uni.reLaunch({ url: target.home })
}
</script>

<style>
.login {
  padding-bottom: 40rpx;
}
.role-name {
  font-size: 32rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}
</style>
