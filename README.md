# 市政锂电设备 · 中国微信小程序商城（一期）

本仓库现在承载蒋成林确认的 **一期销售系统**：微信小程序商城、一层经销商、三种购买方式、汇聚支付接口、角色首页、上架审批。  
**不重建页稿（yegao）**。**不实现远程锁机 / BMS / 4G 通信**，只预留设备事件与指令接口。

小程序在 `miniprogram/`（uni-app Vue 3，便于以后出 App，而不用从微信小程序重写）。

## 怎么在微信开发者工具里跑

1. 安装 [Node.js 18+](https://nodejs.org/) 与 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 安装依赖并编译到微信小程序：

```bash
cd miniprogram
npm install
npm run dev:mp-weixin
```

3. 打开微信开发者工具 → **导入项目**：
   - 目录选 **`miniprogram/dist/dev/mp-weixin`**（开发编译产物，不是 `miniprogram/` 源码根目录）。
   - AppID：可先用测试号 / 游客模式。正式发布前把 `miniprogram/src/manifest.json` 里 `mp-weixin.appid` 改成你们的小程序 AppID。
   - 不要勾选「把 dist 当 npm 工程」。
4. 保存源码后 CLI 会增量编译；开发者工具一般会自动刷新。若没有，点 **编译**。
5. 模拟器里从 **角色登录** 进入：用户/客户、经销商、销售、财务、管理员 各有独立首页。这是开发用模拟登录，还没接微信授权。

生产包：

```bash
cd miniprogram
npm run build:mp-weixin
```

导入目录改为 `miniprogram/dist/build/mp-weixin`。

## 其它预览方式

| 命令 | 用途 |
| --- | --- |
| `npm run dev:h5` | 浏览器预览（默认 http://localhost:5173） |
| `npm run dev:app` | 为后续 App 打资源；真机调试仍用 HBuilderX |
| `npm test` | 一期交易规则与汇聚/设备接口的节点测试 |
| `npm run lint` | Prettier 检查 |

## 演示路径（垂直切片）

1. 用 **用户/客户** 进商城，打开切割机 / 冲击夯 / 平板夯，选三种买法之一（全款、裸机全款+电源分期、裸机全款+电源租赁），模拟上传证件并签字，走 **汇聚支付 mock**。
2. 切到 **经销商**：看到 1 套 Full Pro 库存（上限 2 套）、待交付订单、**模拟交付扫码**、结算列表。
3. 用 **销售** 改售价/促销/服务费/租金并提交；**财务** 审价与确认分账；**管理员** 终审上架，并可把锁机单 **批准入队（不发硬件）**。
4. 客户「我的设备」显示未接入占位。`miniprogram/src/api/device.js` 是二期接口空实现。

商品名与 Full Pro 构成取自 [tsemodux.com](https://www.tsemodux.com/)（2026-11-15）。美元价只作对照，**不是中国售价**。中国售价、促销、服务费、租金全部可编辑，须财务+管理员审批后才对客户可见。

## 汇聚支付

当前没有商户凭证，因此 `miniprogram/src/api/huiju.js` 走 mock（下单、回调、分账接口都在，真实通道未打开）。有商户号后把 `huijuConfig.mock` 设为 `false` 并填 `merchantNo`，不要把密钥提交进仓库。

## 范围外

- 页稿 / yegao
- 64V30AH BMS 改板、中移/移远 4G+GNSS、远程锁机执行
- 振动尺（Electric Vibrating Screed）
- 抹光机分期/租赁（待确认，一期只开放全款）
