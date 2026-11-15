<template>
  <view class="page">
    <view class="hero">
      <view class="eyebrow">用户/客户</view>
      <view class="h1">{{ session ? session.name : '未登录' }}</view>
      <view class="muted">{{ session && session.org }}</view>
    </view>
    <view class="card">
      <view class="muted">客户看不到经销商分成。设备使用、位置、故障要等二期数据接入。</view>
      <button class="btn btn-ghost" @tap="goLogin">切换角色</button>
      <button class="btn btn-ghost" @tap="reset">重置演示数据</button>
    </view>
    <role-tabs active="我的" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import RoleTabs from '../../components/role-tabs.vue'
import { currentRole, resetDemo } from '../../store/index.js'

const session = computed(() => currentRole())

function goLogin() {
  uni.redirectTo({ url: '/pages/login/login' })
}

function reset() {
  resetDemo()
  uni.showToast({ title: '已重置', icon: 'none' })
  uni.reLaunch({ url: '/pages/login/login' })
}
</script>
