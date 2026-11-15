<template>
  <view class="page" v-if="quote">
    <view class="hero">
      <view class="eyebrow">确认订单 · 汇聚支付（模拟）</view>
      <view class="h1">{{ quote.skuName }}</view>
      <view class="muted">{{ quote.methodName }}</view>
    </view>
    <view class="card">
      <view class="row between">
        <text>设备</text>
        <text>{{ money(quote.machineAmount) }}</text>
      </view>
      <view class="row between" style="margin-top: 12rpx">
        <text>{{ quote.power.title }}</text>
        <text>{{ money(quote.power.amountCny) }}</text>
      </view>
      <view class="muted" v-if="quote.power.schedule">{{ quote.power.schedule }}</view>
      <view class="row between total">
        <text>现在应付</text>
        <text>{{ money(quote.dueNow) }}</text>
      </view>
      <view class="muted" v-if="quote.placeholderPrice">金额为演示占位，非正式中国售价。</view>
    </view>
    <view class="card">
      <view class="h1" style="font-size: 32rpx">资质与签字</view>
      <view class="muted"
        >市政客户下单前上传身份证；单位再上传营业执照。电子签方案待选，一期必须有签字动作。</view
      >
      <button class="btn" :class="idUploaded ? 'btn-accent' : 'btn-ghost'" @tap="idUploaded = true">
        {{ idUploaded ? '已模拟上传身份证' : '模拟上传身份证' }}
      </button>
      <button
        class="btn"
        :class="orgLicense ? 'btn-accent' : 'btn-ghost'"
        @tap="orgLicense = !orgLicense"
      >
        {{ orgLicense ? '已模拟上传营业执照' : '单位：模拟上传营业执照' }}
      </button>
      <button class="btn" :class="signed ? 'btn-accent' : 'btn-ghost'" @tap="signed = true">
        {{ signed ? '法定代表人或授权人已签字' : '签署买卖/分期/租赁协议' }}
      </button>
    </view>
    <button class="btn btn-accent" @tap="pay">汇聚支付（模拟收款）</button>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { checkout, formatCny, store } from '../../store/index.js'
import { quoteOrder } from '../../store/engine.js'

const skuId = ref('')
const method = ref('full')
const source = ref('tap')
const idUploaded = ref(false)
const orgLicense = ref(false)
const signed = ref(false)

const quoted = computed(() => quoteOrder(store, { skuId: skuId.value, method: method.value }))
const quote = computed(() => (quoted.value.ok ? quoted.value.quote : null))

onLoad((query) => {
  skuId.value = (query && query.id) || ''
  method.value = (query && query.method) || 'full'
  source.value = (query && query.source) || 'tap'
})

function money(value) {
  return formatCny(value, quote.value && quote.value.placeholderPrice)
}

async function pay() {
  const result = await checkout({
    skuId: skuId.value,
    method: method.value,
    source: source.value,
    idUploaded: idUploaded.value,
    orgLicense: orgLicense.value,
    signed: signed.value
  })
  if (!result.ok) {
    uni.showToast({ title: result.error, icon: 'none' })
    return
  }
  uni.showToast({ title: '支付成功（模拟）', icon: 'success' })
  setTimeout(() => {
    uni.redirectTo({ url: '/pages/customer/orders' })
  }, 400)
}
</script>

<style>
.total {
  margin-top: 20rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #eef2f0;
  font-weight: 700;
  font-size: 32rpx;
}
</style>
