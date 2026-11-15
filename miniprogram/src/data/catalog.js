/**
 * Full Pro SKU 与两台抹光机。
 * 名称与构成取自 tsemodux.com（2026-11-15）。
 * 美元价只作官网对照，不是中国售价。
 */

export const FULL_PRO_COMPOSITION = [
  { skuId: 'saw-20', qty: 1 },
  { skuId: 'plate-90', qty: 1 },
  { skuId: 'rammer-75', qty: 1 },
  { skuId: 'station', qty: 2 },
  { skuId: 'pack', qty: 8 },
  { skuId: 'dock', qty: 1 }
]

export const SKUS = [
  {
    id: 'saw-20',
    kind: 'bare',
    en: '20-inch Battery Floor Saw',
    name: '20 英寸电池切割机（裸机）',
    group: '市政四件套',
    summary: '道路与地坪切割。需要时一次切到 186 mm。',
    specs: [
      { label: '刀片', value: '20 英寸' },
      { label: '一次切割深度', value: '186 mm（实测）' },
      { label: '售卖形态', value: '裸机' }
    ],
    usdReference: null,
    color: '#1d4f7a',
    mark: '切',
    inFullPro: true,
    buyMethods: ['full', 'installment', 'rent']
  },
  {
    id: 'rammer-75',
    kind: 'bare',
    en: '75 kg-class Battery Rammer',
    name: '75 kg 级电池冲击夯（裸机）',
    group: '市政四件套',
    summary: '沟槽与回填夯实。',
    specs: [
      { label: '参考续航', value: '约 80 分钟 / 1 Pack' },
      { label: '冲击力', value: '15 kN' },
      { label: '售卖形态', value: '裸机' }
    ],
    usdReference: 4500,
    color: '#b45309',
    mark: '夯',
    inFullPro: true,
    buyMethods: ['full', 'installment', 'rent']
  },
  {
    id: 'plate-90',
    kind: 'bare',
    en: '90 kg-class Battery Plate Compactor',
    name: '90 kg 级电池平板夯（裸机）',
    group: '市政四件套',
    summary: '颗粒基层与沥青修补压实。',
    specs: [
      { label: '参考续航', value: '约 80 分钟 / 1 Pack' },
      { label: '离心力', value: '15 kN' },
      { label: '售卖形态', value: '裸机' }
    ],
    usdReference: null,
    color: '#047857',
    mark: '压',
    inFullPro: true,
    buyMethods: ['full', 'installment', 'rent']
  },
  {
    id: 'pack',
    kind: 'power',
    en: 'Shared battery Pack',
    name: '共享电池 Pack',
    group: '模块化锂电电源',
    summary: '高倍率磷酸铁锂，市政机械与现场交流电源共用。',
    specs: [
      { label: '类型', value: '可拆卸共享 Pack' },
      { label: '重量', value: '约 18 kg / 块' },
      { label: '化学体系', value: '高倍率 LFP' },
      { label: '循环参考', value: '标准工况 1500 次后约 80% 容量' }
    ],
    usdReference: null,
    color: '#6d28d9',
    mark: '电',
    inFullPro: true,
    buyMethods: ['full', 'installment', 'rent']
  },
  {
    id: 'station',
    kind: 'power',
    en: 'Station battery cart',
    name: 'Station 电池车',
    group: '模块化锂电电源',
    summary: '移动电源车。Full Pro 含 2 台，共用一台 Dock。',
    specs: [
      { label: '角色', value: '电池车 / 移动电源底盘' },
      { label: 'Full Pro 数量', value: '2 台' }
    ],
    usdReference: null,
    color: '#0f766e',
    mark: '车',
    inFullPro: true,
    buyMethods: ['full', 'installment', 'rent']
  },
  {
    id: 'dock',
    kind: 'power',
    en: 'Dock inverter / charging head',
    name: 'Dock 逆变器 / 充电头',
    group: '模块化锂电电源',
    summary: '一台 Dock 带两台 Station，不是两套独立交流电源。',
    specs: [
      { label: '额定功率', value: '5.5 kW' },
      { label: '峰值功率', value: '15 kW' },
      { label: '逆变器', value: '低频 · 约 7.7 kWh 参考' }
    ],
    usdReference: null,
    color: '#b91c1c',
    mark: '充',
    inFullPro: true,
    buyMethods: ['full', 'installment', 'rent']
  },
  {
    id: 'trowel-24',
    kind: 'trowel',
    en: '24-inch Electric Power Trowel',
    name: '24 英寸电动抹光机',
    group: '抹光机',
    summary: '较小地坪与狭窄作业面收光。购买方式一期暂按全款。',
    specs: [
      { label: '盘径', value: '24 英寸' },
      { label: '参考续航', value: '约 42 分钟 / 1 Pack' }
    ],
    usdReference: null,
    color: '#92400e',
    mark: '抹',
    inFullPro: false,
    buyMethods: ['full']
  },
  {
    id: 'trowel-36',
    kind: 'trowel',
    en: '36-inch Electric Power Trowel',
    name: '36 英寸电动抹光机',
    group: '抹光机',
    summary: '较大地坪、车间与库房收光。购买方式一期暂按全款。',
    specs: [
      { label: '盘径', value: '36 英寸' },
      { label: '参考续航', value: '约 55 分钟 / 1 Pack' }
    ],
    usdReference: null,
    color: '#78350f',
    mark: '抹',
    inFullPro: false,
    buyMethods: ['full']
  }
]

export const BUY_METHODS = [
  {
    id: 'full',
    name: '全款',
    short: '一次付清',
    desc: '裸机与电源一次付清。全款电源不进入锁机台账。'
  },
  {
    id: 'installment',
    name: '裸机全款 + 电源分期',
    short: '分期',
    desc: '裸机当场付清；电源按已审批的分期计划走汇聚支付。欠费一期只记账。'
  },
  {
    id: 'rent',
    name: '裸机全款 + 电源租赁',
    short: '租赁',
    desc: '裸机当场付清；电源所有权仍在公司，客户按已审批租金支付。欠费一期只记账。'
  }
]

export const ROLES = [
  {
    id: 'customer',
    label: '用户/客户',
    home: '/pages/mall/index',
    blurb: '商城、下单付款、合同资质、自己的订单与设备'
  },
  {
    id: 'dealer',
    label: '经销商',
    home: '/pages/dealer/home',
    blurb: '1～2 套铺货、交付扫码、本店结算、招标自下单'
  },
  {
    id: 'sales',
    label: '销售',
    home: '/pages/sales/home',
    blurb: '商品草稿、服务费与租金、经销商与铺货'
  },
  {
    id: 'finance',
    label: '财务',
    home: '/pages/finance/home',
    blurb: '收款核对、价格复核、分成确认、保证金'
  },
  {
    id: 'admin',
    label: '管理员',
    home: '/pages/admin/home',
    blurb: '上架终审、锁定审批（只入队）、分成与招标终审'
  }
]

export function skuById(id) {
  return SKUS.find((item) => item.id === id) || null
}
