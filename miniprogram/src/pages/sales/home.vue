<template>
  <view class="page">
    <view class="hero">
      <view class="eyebrow">销售</view>
      <view class="h1">上架草稿与条款</view>
      <view class="muted"
        >改价格、促销、服务费、租金后，必须财务审价、管理员终审。未过审客户不可见。</view
      >
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">商品草稿</view>
      <picker :range="skuNames" @change="onSku">
        <view class="input">{{ currentSku.name }}</view>
      </picker>
      <view class="field">
        <view class="muted">中国售价（元，可空）</view>
        <input
          class="input"
          type="digit"
          v-model="form.priceCny"
          placeholder="不定死，留空即待定价"
        />
      </view>
      <view class="field">
        <view class="muted">促销价（元，可空）</view>
        <input class="input" type="digit" v-model="form.promoCny" placeholder="偶尔促销" />
      </view>
      <view class="field">
        <view class="muted">规格/卖点说明</view>
        <textarea class="input" v-model="form.specNote" auto-height />
      </view>
      <button class="btn btn-accent" @tap="submitListing">提交财务审价</button>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">服务费 / 租金</view>
      <view class="field">
        <view class="muted">销售服务费比例 %</view>
        <input
          class="input"
          type="digit"
          v-model="fee.serviceFeeRatePercent"
          placeholder="不写死"
        />
      </view>
      <view class="field">
        <view class="muted">电源每期租金（元）</view>
        <input
          class="input"
          type="digit"
          v-model="fee.powerRentPerPeriodCny"
          placeholder="不写死"
        />
      </view>
      <view class="field">
        <view class="muted">电源每期分期额（元）</view>
        <input
          class="input"
          type="digit"
          v-model="fee.powerInstallmentPerPeriodCny"
          placeholder="不写死"
        />
      </view>
      <button class="btn btn-accent" @tap="submitFee">提交条款审批</button>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">商品状态</view>
      <view v-for="row in listings" :key="row.skuId" class="row between spec">
        <text>{{ nameOf(row.skuId) }}</text>
        <text class="chip" :class="row.status === 'approved' ? '' : 'chip-warn'">{{
          listingStatusLabel(row.status)
        }}</text>
      </view>
    </view>
    <button class="btn btn-ghost" @tap="goLogin">切换角色</button>
    <role-tabs active="工作台" />
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import RoleTabs from '../../components/role-tabs.vue'
import { SKUS, skuById } from '../../data/catalog.js'
import { listingStatusLabel, saveCommercial, saveListing, store } from '../../store/index.js'

const skuNames = SKUS.map((item) => item.name)
const currentSku = ref(SKUS[0])
const listings = store.listings
const form = reactive({
  priceCny: '',
  promoCny: '',
  specNote: SKUS[0].summary
})
const fee = reactive({
  serviceFeeRatePercent: '',
  powerRentPerPeriodCny: '',
  powerInstallmentPerPeriodCny: ''
})

function goLogin() {
  uni.redirectTo({ url: '/pages/login/login' })
}

function onSku(event) {
  currentSku.value = SKUS[event.detail.value]
  form.specNote = currentSku.value.summary
}

function nameOf(id) {
  const sku = skuById(id)
  return sku ? sku.name : id
}

function submitListing() {
  const result = saveListing({
    skuId: currentSku.value.id,
    priceCny: form.priceCny,
    promoCny: form.promoCny,
    specNote: form.specNote,
    photoNote: '销售已更新图文（演示）'
  })
  uni.showToast({
    title: result.ok ? '已送财务' : result.error,
    icon: result.ok ? 'success' : 'none'
  })
}

function submitFee() {
  const result = saveCommercial({
    serviceFeeRatePercent:
      fee.serviceFeeRatePercent === '' ? null : Number(fee.serviceFeeRatePercent),
    powerRentPerPeriodCny:
      fee.powerRentPerPeriodCny === '' ? null : Number(fee.powerRentPerPeriodCny),
    powerInstallmentPerPeriodCny:
      fee.powerInstallmentPerPeriodCny === '' ? null : Number(fee.powerInstallmentPerPeriodCny)
  })
  uni.showToast({
    title: result.ok ? '条款已送审' : result.error,
    icon: result.ok ? 'success' : 'none'
  })
}
</script>

<style>
.spec {
  padding: 12rpx 0;
}
</style>
