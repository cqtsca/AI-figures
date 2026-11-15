<script>
import { currentRole } from './store/index.js'

export default {
  onLaunch() {
    const session = currentRole()
    if (session) {
      console.log('session', session.role)
    }
  }
}
</script>

<style>
page {
  background: #eef2f0;
  color: #1b2430;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Noto Sans SC', sans-serif;
  font-size: 28rpx;
  line-height: 1.45;
}

.page {
  min-height: 100%;
  padding: 24rpx 24rpx 160rpx;
  box-sizing: border-box;
}

/* #ifdef H5 */
page {
  display: flex;
  justify-content: center;
  background: #d9e0dc;
}
.page {
  width: 390px;
  max-width: 100%;
  background: #eef2f0;
}
/* #endif */

.hero,
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(16, 36, 58, 0.04);
}

.eyebrow {
  font-size: 22rpx;
  letter-spacing: 2rpx;
  color: #5b6b73;
  margin-bottom: 8rpx;
}

.h1 {
  font-size: 40rpx;
  font-weight: 700;
  color: #10243a;
}

.muted {
  color: #5b6b73;
  font-size: 24rpx;
}

.row {
  display: flex;
  align-items: center;
}

.between {
  justify-content: space-between;
}

.btn {
  margin-top: 16rpx;
  background: #10243a;
  color: #fff;
  border: none;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.btn-ghost {
  background: #e8eee9;
  color: #10243a;
}

.btn-accent {
  background: #1f7a63;
  color: #fff;
}

.btn-warn {
  background: #c47b17;
  color: #fff;
}

.chip {
  display: inline-flex;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  background: #e8eee9;
  color: #1f7a63;
  font-size: 22rpx;
}

.chip-warn {
  background: #f8ead3;
  color: #8a5a10;
}

.field {
  margin-top: 16rpx;
}

.input {
  background: #f4f6f5;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  min-height: 72rpx;
  box-sizing: border-box;
}

.mark {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: 700;
  flex-shrink: 0;
}

button::after {
  border: none;
}
</style>
