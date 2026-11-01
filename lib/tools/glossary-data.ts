// 名称: 外贸术语库数据
// 描述: 由《外贸术语中英对照表 2026-11》整理，共 505 条术语、31 条邮件句式、100 个缩写
// 路径: ExportBox/lib/tools/glossary-data.ts
// 作者: ExportBox
// 更新时间: 2026-11-01
// 说明: 本文件由 Excel 自动生成，请勿手工改动；如需更新请重新导入表格。

export interface GlossaryTerm {
  id: string
  category: string
  zh: string
  en: string
  abbr: string
  meaning: string
  usage: string
  note: string
}

export interface GlossaryCategory {
  id: string
  name: string
  sheet: string
  count: number
}

export interface GlossaryPhrase {
  id: string
  scene: string
  zh: string
  en: string
  tip: string
}

export interface GlossaryAbbr {
  abbr: string
  full: string
  zh: string
  group: string
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  {
    "id": "01",
    "name": "贸易术语",
    "sheet": "贸易术语 Incoterms",
    "count": 26
  },
  {
    "id": "02",
    "name": "询盘报价",
    "sheet": "询盘·报价·合同",
    "count": 54
  },
  {
    "id": "03",
    "name": "价格成本",
    "sheet": "价格·成本·佣金",
    "count": 40
  },
  {
    "id": "04",
    "name": "支付结算",
    "sheet": "支付·结算·信用证",
    "count": 65
  },
  {
    "id": "05",
    "name": "包装唛头",
    "sheet": "包装·唛头·重量",
    "count": 39
  },
  {
    "id": "06",
    "name": "运输物流",
    "sheet": "运输·物流·提单",
    "count": 54
  },
  {
    "id": "07",
    "name": "报关退税",
    "sheet": "报关·退税·原产地",
    "count": 50
  },
  {
    "id": "08",
    "name": "保险索赔",
    "sheet": "保险·索赔",
    "count": 35
  },
  {
    "id": "09",
    "name": "质量验货",
    "sheet": "质量·验货·认证",
    "count": 39
  },
  {
    "id": "10",
    "name": "客户谈判",
    "sheet": "客户·谈判·沟通",
    "count": 39
  },
  {
    "id": "11",
    "name": "风险合规",
    "sheet": "风险·合规·法律",
    "count": 37
  },
  {
    "id": "12",
    "name": "短语搭配",
    "sheet": "常用短语搭配",
    "count": 27
  }
]

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    "id": "01-1",
    "category": "01",
    "zh": "工厂交货",
    "en": "Ex Works",
    "abbr": "EXW",
    "meaning": "卖方在其场所（工厂、仓库）备妥货物即完成交货，买方承担自提货起的全部费用与风险",
    "usage": "EXW Shanghai / EXW our factory",
    "note": "卖方不负责装车与出口报关；买方须能自行办理出口手续，实操中慎用于无出口资质客户"
  },
  {
    "id": "01-2",
    "category": "01",
    "zh": "货交承运人",
    "en": "Free Carrier",
    "abbr": "FCA",
    "meaning": "卖方在指定地点把货物交给买方指定的承运人，即完成交货",
    "usage": "FCA Shenzhen Warehouse",
    "note": "适用于任何运输方式；2020 版允许买卖双方约定签发已装船提单"
  },
  {
    "id": "01-3",
    "category": "01",
    "zh": "运费付至",
    "en": "Carriage Paid To",
    "abbr": "CPT",
    "meaning": "卖方支付运费至指定目的地，但风险在货物交给第一承运人时即转移给买方",
    "usage": "CPT Hamburg",
    "note": "费用转移点晚于风险转移点，别把两者混为一谈"
  },
  {
    "id": "01-4",
    "category": "01",
    "zh": "运费、保险费付至",
    "en": "Carriage and Insurance Paid To",
    "abbr": "CIP",
    "meaning": "在 CPT 基础上，卖方还需自费投保",
    "usage": "CIP Rotterdam",
    "note": "Incoterms 2020 要求 CIP 投保 ICC(A) 一切险，比 CIF 要求更高"
  },
  {
    "id": "01-5",
    "category": "01",
    "zh": "目的地交货",
    "en": "Delivered at Place",
    "abbr": "DAP",
    "meaning": "卖方负责将货物运至指定目的地，货物在运输工具上未卸下即交付",
    "usage": "DAP Frankfurt Airport",
    "note": "进口清关与卸货由买方负责；卖方要承担到目的地前的全部风险"
  },
  {
    "id": "01-6",
    "category": "01",
    "zh": "卸货地交货",
    "en": "Delivered at Place Unloaded",
    "abbr": "DPU",
    "meaning": "卖方在指定目的地卸货后完成交付",
    "usage": "DPU Buyer's Warehouse",
    "note": "2020 版新增，取代 2010 版的 DAT；11 个术语中唯一要求卖方卸货的"
  },
  {
    "id": "01-7",
    "category": "01",
    "zh": "完税后交货",
    "en": "Delivered Duty Paid",
    "abbr": "DDP",
    "meaning": "卖方承担包括进口关税、清关在内的全部责任与费用",
    "usage": "DDP Los Angeles",
    "note": "卖方义务最重，需具备目的地国清关能力或税号，慎用"
  },
  {
    "id": "01-8",
    "category": "01",
    "zh": "船边交货",
    "en": "Free Alongside Ship",
    "abbr": "FAS",
    "meaning": "卖方将货物送至装运港指定船舶的船边即完成交货",
    "usage": "FAS Ningbo",
    "note": "仅适用于海运和内河运输；大宗散杂货常用"
  },
  {
    "id": "01-9",
    "category": "01",
    "zh": "装运港船上交货",
    "en": "Free On Board",
    "abbr": "FOB",
    "meaning": "货物在指定装运港装上买方指定船舶后，风险转移给买方",
    "usage": "FOB Shanghai",
    "note": "仅海运；后面跟装运港而非目的港；集装箱货建议改用 FCA"
  },
  {
    "id": "01-10",
    "category": "01",
    "zh": "成本加运费",
    "en": "Cost and Freight",
    "abbr": "CFR",
    "meaning": "卖方支付海运费至指定目的港，但风险在装运港装船时已转移",
    "usage": "CFR Hamburg",
    "note": "CFR / CIF 后面跟的是目的港，这是最常见的报价错误"
  },
  {
    "id": "01-11",
    "category": "01",
    "zh": "成本、保险费加运费",
    "en": "Cost, Insurance and Freight",
    "abbr": "CIF",
    "meaning": "在 CFR 基础上，卖方还需办理货运保险并支付保费",
    "usage": "CIF Rotterdam",
    "note": "CIF 是单据买卖；保险只要求最低险别 ICC(C)"
  },
  {
    "id": "01-12",
    "category": "01",
    "zh": "装运港",
    "en": "Port of Loading",
    "abbr": "POL",
    "meaning": "货物装船的港口",
    "usage": "Port of loading: Shanghai",
    "note": "与目的港不要写反"
  },
  {
    "id": "01-13",
    "category": "01",
    "zh": "目的港",
    "en": "Port of Destination",
    "abbr": "POD",
    "meaning": "货物卸船的港口",
    "usage": "Port of destination: Hamburg",
    "note": "合同中应写明具体港口，避免'European main ports'这类模糊表述"
  },
  {
    "id": "01-14",
    "category": "01",
    "zh": "交货地点",
    "en": "Place of Delivery",
    "abbr": "—",
    "meaning": "合同中约定的具体交货地点，是风险转移的关键坐标",
    "usage": "Place of delivery: Buyer's warehouse, Milan",
    "note": "只写城市不够，建议写到仓库/堆场"
  },
  {
    "id": "01-15",
    "category": "01",
    "zh": "风险转移",
    "en": "Transfer of Risk",
    "abbr": "—",
    "meaning": "货物灭失或损坏的风险由卖方转由买方承担的时点",
    "usage": "Risk passes when the goods are on board",
    "note": "不同术语的转移点不同，索赔时首先看这一条"
  },
  {
    "id": "01-16",
    "category": "01",
    "zh": "费用划分",
    "en": "Allocation of Costs",
    "abbr": "—",
    "meaning": "运费、保险费、清关费、卸货费等由哪一方承担",
    "usage": "Costs are allocated as per Incoterms 2020",
    "note": "费用划分点与风险转移点可能不一致"
  },
  {
    "id": "01-17",
    "category": "01",
    "zh": "出口清关",
    "en": "Export Clearance",
    "abbr": "—",
    "meaning": "办理出口报关、缴纳出口环节税费的手续",
    "usage": "Export clearance by the seller",
    "note": "EXW 下由买方办理，DDP 下由卖方办理"
  },
  {
    "id": "01-18",
    "category": "01",
    "zh": "进口清关",
    "en": "Import Clearance",
    "abbr": "—",
    "meaning": "办理进口报关、缴纳关税与进口环节税的手续",
    "usage": "Import clearance is the buyer's responsibility under DAP",
    "note": "DDP 下由卖方负责，因此报价时必须把关税算进去"
  },
  {
    "id": "01-19",
    "category": "01",
    "zh": "象征性交货",
    "en": "Symbolic Delivery",
    "abbr": "—",
    "meaning": "卖方以交付单据代替交付货物，买方凭单付款",
    "usage": "CIF is a symbolic delivery term",
    "note": "CFR / CIF 属于象征性交货，与 DAP / DDP 的实际交货相对"
  },
  {
    "id": "01-20",
    "category": "01",
    "zh": "实际交货",
    "en": "Actual Delivery",
    "abbr": "—",
    "meaning": "卖方将货物实际交到买方或其指定地点",
    "usage": "EXW / DAP / DDP are actual delivery terms",
    "note": "实际交货术语下卖方风险更大"
  },
  {
    "id": "01-21",
    "category": "01",
    "zh": "已装船提单",
    "en": "Shipped on Board Bill of Lading",
    "abbr": "—",
    "meaning": "货物实际装船后签发的提单，注明装船日期",
    "usage": "Shipped on board B/L dated 12 May",
    "note": "信用证通常要求已装船提单，备运提单不合格"
  },
  {
    "id": "01-22",
    "category": "01",
    "zh": "多式联运",
    "en": "Multimodal Transport",
    "abbr": "—",
    "meaning": "使用两种及以上运输方式完成全程运输",
    "usage": "Multimodal transport document",
    "note": "相应单据为多式联运单据 MTD"
  },
  {
    "id": "01-23",
    "category": "01",
    "zh": "集装箱堆场",
    "en": "Container Yard",
    "abbr": "CY",
    "meaning": "整箱货交接、堆存的场所",
    "usage": "CY-CY",
    "note": "整箱交接常见条款"
  },
  {
    "id": "01-24",
    "category": "01",
    "zh": "集装箱货运站",
    "en": "Container Freight Station",
    "abbr": "CFS",
    "meaning": "拼箱货拆装箱、交接的场所",
    "usage": "CFS-CFS",
    "note": "拼箱货常用"
  },
  {
    "id": "01-25",
    "category": "01",
    "zh": "承运人",
    "en": "Carrier",
    "abbr": "—",
    "meaning": "与托运人订立运输合同、负责运输货物的主体",
    "usage": "The carrier is responsible for the goods in transit",
    "note": "承运人≠货代，责任范围不同"
  },
  {
    "id": "01-26",
    "category": "01",
    "zh": "货运代理人",
    "en": "Freight Forwarder",
    "abbr": "—",
    "meaning": "替货主安排订舱、报关、运输等事宜的服务商",
    "usage": "We will book the space through our forwarder",
    "note": "货代通常不承担承运人责任"
  },
  {
    "id": "02-1",
    "category": "02",
    "zh": "询盘",
    "en": "Inquiry / Enquiry",
    "abbr": "—",
    "meaning": "买方向卖方询问商品价格、规格等交易条件",
    "usage": "Thank you for your inquiry dated 5 May",
    "note": "询盘对双方无法律约束力"
  },
  {
    "id": "02-2",
    "category": "02",
    "zh": "发盘",
    "en": "Offer",
    "abbr": "—",
    "meaning": "一方提出交易条件并愿受其约束的意思表示",
    "usage": "We hereby offer you as follows",
    "note": "内容须十分确定（品名、数量、价格）"
  },
  {
    "id": "02-3",
    "category": "02",
    "zh": "实盘",
    "en": "Firm Offer",
    "abbr": "—",
    "meaning": "规定有效期内不可撤销的发盘",
    "usage": "This is a firm offer, open until 20 May",
    "note": "实盘一经接受即成立合同"
  },
  {
    "id": "02-4",
    "category": "02",
    "zh": "虚盘",
    "en": "Non-firm Offer",
    "abbr": "—",
    "meaning": "附有保留条件、不受约束的发盘",
    "usage": "Subject to our final confirmation",
    "note": "本质是邀请对方发盘"
  },
  {
    "id": "02-5",
    "category": "02",
    "zh": "还盘",
    "en": "Counter-offer",
    "abbr": "—",
    "meaning": "受盘人对发盘条件提出修改",
    "usage": "We counter-offer at USD 12.50 per piece",
    "note": "还盘即构成对原发盘的拒绝"
  },
  {
    "id": "02-6",
    "category": "02",
    "zh": "接受",
    "en": "Acceptance",
    "abbr": "—",
    "meaning": "受盘人无条件同意发盘全部条件",
    "usage": "We accept your offer of 5 May",
    "note": "附条件接受视为还盘"
  },
  {
    "id": "02-7",
    "category": "02",
    "zh": "撤回",
    "en": "Withdrawal",
    "abbr": "—",
    "meaning": "发盘在送达受盘人之前收回",
    "usage": "The offer was withdrawn before it reached the buyer",
    "note": "撤回须在生效前送达"
  },
  {
    "id": "02-8",
    "category": "02",
    "zh": "撤销",
    "en": "Revocation",
    "abbr": "—",
    "meaning": "发盘送达后、接受前取消",
    "usage": "The seller revoked the offer",
    "note": "实盘在有效期内原则上不可撤销"
  },
  {
    "id": "02-9",
    "category": "02",
    "zh": "有效期",
    "en": "Validity",
    "abbr": "—",
    "meaning": "发盘、报价或信用证的有效期限",
    "usage": "Validity: 30 days from the date of issue",
    "note": "过期即失效，注意时区与工作日"
  },
  {
    "id": "02-10",
    "category": "02",
    "zh": "报价",
    "en": "Quotation",
    "abbr": "—",
    "meaning": "向客户提供价格及相关交易条件",
    "usage": "Please find our quotation attached",
    "note": "报价一般不属于发盘"
  },
  {
    "id": "02-11",
    "category": "02",
    "zh": "报价单",
    "en": "Quotation Sheet",
    "abbr": "—",
    "meaning": "列明品名、规格、单价、包装等条件的表格",
    "usage": "Quotation sheet No. QT-2026-018",
    "note": "注明报价有效期与贸易术语"
  },
  {
    "id": "02-12",
    "category": "02",
    "zh": "价格表",
    "en": "Price List",
    "abbr": "—",
    "meaning": "产品通用价格目录",
    "usage": "2026 price list",
    "note": "价格表通常为参考价，需注明'以确认为准'"
  },
  {
    "id": "02-13",
    "category": "02",
    "zh": "目标价",
    "en": "Target Price",
    "abbr": "—",
    "meaning": "买方希望达成的成交价格",
    "usage": "Our target price is USD 11 per unit",
    "note": "与底价区分"
  },
  {
    "id": "02-14",
    "category": "02",
    "zh": "底价",
    "en": "Floor Price",
    "abbr": "—",
    "meaning": "卖方能让出的最低价格",
    "usage": "This is our floor price",
    "note": "口头使用即可，不宜写进正式邮件"
  },
  {
    "id": "02-15",
    "category": "02",
    "zh": "参考价",
    "en": "Reference Price",
    "abbr": "—",
    "meaning": "仅供参照、可协商的价格",
    "usage": "Indicative price for reference only",
    "note": "务必标明'reference only'"
  },
  {
    "id": "02-16",
    "category": "02",
    "zh": "暂定价",
    "en": "Provisional Price",
    "abbr": "—",
    "meaning": "先按估算价成交，事后按约定方法调整",
    "usage": "Provisional price subject to final adjustment",
    "note": "常见于大宗商品"
  },
  {
    "id": "02-17",
    "category": "02",
    "zh": "滑动价格",
    "en": "Sliding Price",
    "abbr": "—",
    "meaning": "随原材料、汇率等指数变动而调整的价格",
    "usage": "Sliding price clause based on steel index",
    "note": "须约定调整公式与基准"
  },
  {
    "id": "02-18",
    "category": "02",
    "zh": "订单",
    "en": "Order",
    "abbr": "—",
    "meaning": "买方提出的购买请求",
    "usage": "We are pleased to place an order for 5,000 pcs",
    "note": "订单经卖方确认后才成立合同"
  },
  {
    "id": "02-19",
    "category": "02",
    "zh": "采购订单",
    "en": "Purchase Order",
    "abbr": "PO",
    "meaning": "买方内部生成的正式采购单据",
    "usage": "PO No. 2026-0518",
    "note": "客户 PO 的条款若与合同冲突，需书面澄清"
  },
  {
    "id": "02-20",
    "category": "02",
    "zh": "销售合同",
    "en": "Sales Contract",
    "abbr": "S/C",
    "meaning": "买卖双方就交易达成的书面协议",
    "usage": "Sales contract No. SC2026-011",
    "note": "签字盖章后生效，条款要完整"
  },
  {
    "id": "02-21",
    "category": "02",
    "zh": "销售确认书",
    "en": "Sales Confirmation",
    "abbr": "S/C",
    "meaning": "内容较简化的合同形式",
    "usage": "Please sign and return one copy of the S/C",
    "note": "与销售合同法律效力相同"
  },
  {
    "id": "02-22",
    "category": "02",
    "zh": "形式发票",
    "en": "Proforma Invoice",
    "abbr": "PI",
    "meaning": "报价或用于客户申请外汇、开证的参照性发票",
    "usage": "Proforma invoice for L/C opening",
    "note": "不是正式结算凭证，但客户常用来付款"
  },
  {
    "id": "02-23",
    "category": "02",
    "zh": "商业发票",
    "en": "Commercial Invoice",
    "abbr": "CI",
    "meaning": "正式结算与报关用的发票",
    "usage": "Commercial invoice in triplicate",
    "note": "金额须与合同、信用证一致"
  },
  {
    "id": "02-24",
    "category": "02",
    "zh": "合同条款",
    "en": "Terms and Conditions",
    "abbr": "T&C",
    "meaning": "合同的全部约定内容",
    "usage": "Please review the terms and conditions",
    "note": "客户自己的 T&C 要逐条看"
  },
  {
    "id": "02-25",
    "category": "02",
    "zh": "规格",
    "en": "Specification",
    "abbr": "Spec",
    "meaning": "产品的技术参数与质量要求",
    "usage": "Specification as per our datasheet",
    "note": "规格变更须书面确认"
  },
  {
    "id": "02-26",
    "category": "02",
    "zh": "数量",
    "en": "Quantity",
    "abbr": "Qty",
    "meaning": "成交的商品数量",
    "usage": "Quantity: 10,000 pieces",
    "note": "与溢短装条款配合使用"
  },
  {
    "id": "02-27",
    "category": "02",
    "zh": "单价",
    "en": "Unit Price",
    "abbr": "—",
    "meaning": "每单位商品的价格",
    "usage": "Unit price: USD 12.50/pc FOB Shanghai",
    "note": "必须带贸易术语与币种"
  },
  {
    "id": "02-28",
    "category": "02",
    "zh": "总价",
    "en": "Total Amount",
    "abbr": "—",
    "meaning": "全部货物的成交总额",
    "usage": "Total amount: USD 125,000.00",
    "note": "大小写金额要一致"
  },
  {
    "id": "02-29",
    "category": "02",
    "zh": "溢短装条款",
    "en": "More or Less Clause",
    "abbr": "—",
    "meaning": "允许实际交货数量在约定幅度内增减",
    "usage": "With 5% more or less at seller's option",
    "note": "散装货必备；信用证下要在金额内"
  },
  {
    "id": "02-30",
    "category": "02",
    "zh": "交货期",
    "en": "Delivery Time / Lead Time",
    "abbr": "—",
    "meaning": "从下单到交货所需的时间",
    "usage": "Lead time: 30 days after receipt of deposit",
    "note": "写清起算点，否则必扯皮"
  },
  {
    "id": "02-31",
    "category": "02",
    "zh": "装运期",
    "en": "Time of Shipment",
    "abbr": "—",
    "meaning": "合同约定的装运时间",
    "usage": "Shipment to be effected during June 2026",
    "note": "与交货期不完全等同"
  },
  {
    "id": "02-32",
    "category": "02",
    "zh": "付款条件",
    "en": "Payment Terms",
    "abbr": "—",
    "meaning": "约定的付款方式与时间",
    "usage": "Payment terms: 30% T/T in advance, 70% before shipment",
    "note": "付款条件直接决定资金风险"
  },
  {
    "id": "02-33",
    "category": "02",
    "zh": "包装条款",
    "en": "Packing Clause",
    "abbr": "—",
    "meaning": "对包装材料、方式、标识的约定",
    "usage": "Packing: 1 pc per polybag, 20 pcs per carton",
    "note": "包装不合格是常见索赔原因"
  },
  {
    "id": "02-34",
    "category": "02",
    "zh": "保险条款",
    "en": "Insurance Clause",
    "abbr": "—",
    "meaning": "约定投保险别、金额与责任方",
    "usage": "Insurance: 110% of invoice value, All Risks",
    "note": "CIF 下卖方投保，其他术语常由买方投保"
  },
  {
    "id": "02-35",
    "category": "02",
    "zh": "检验条款",
    "en": "Inspection Clause",
    "abbr": "—",
    "meaning": "约定检验机构、标准与时间",
    "usage": "Inspection by SGS at port of loading",
    "note": "第三方检验费用由谁承担要写明"
  },
  {
    "id": "02-36",
    "category": "02",
    "zh": "索赔条款",
    "en": "Claim Clause",
    "abbr": "—",
    "meaning": "约定索赔的期限、依据与程序",
    "usage": "Claims must be raised within 30 days after arrival",
    "note": "期限过短等于放弃索赔权"
  },
  {
    "id": "02-37",
    "category": "02",
    "zh": "不可抗力条款",
    "en": "Force Majeure Clause",
    "abbr": "—",
    "meaning": "约定不可抗力事件的认定与后果",
    "usage": "Force majeure clause per ICC 2003",
    "note": "疫情、限电是否算需明确列举"
  },
  {
    "id": "02-38",
    "category": "02",
    "zh": "仲裁条款",
    "en": "Arbitration Clause",
    "abbr": "—",
    "meaning": "约定争议提交仲裁的机构与规则",
    "usage": "Arbitration: CIETAC, Beijing",
    "note": "仲裁条款写不明可能无效"
  },
  {
    "id": "02-39",
    "category": "02",
    "zh": "违约条款",
    "en": "Default Clause",
    "abbr": "—",
    "meaning": "约定违约情形与责任",
    "usage": "Default clause with liquidated damages",
    "note": ""
  },
  {
    "id": "02-40",
    "category": "02",
    "zh": "保密条款",
    "en": "Confidentiality Clause",
    "abbr": "—",
    "meaning": "约定商业秘密的保护义务",
    "usage": "Mutual confidentiality clause",
    "note": "打样、报价阶段就应签署 NDA"
  },
  {
    "id": "02-41",
    "category": "02",
    "zh": "适用法律",
    "en": "Governing Law",
    "abbr": "—",
    "meaning": "合同争议所适用的法律",
    "usage": "This contract is governed by the laws of Singapore",
    "note": "与仲裁地可以不同"
  },
  {
    "id": "02-42",
    "category": "02",
    "zh": "合同生效",
    "en": "Effectiveness of Contract",
    "abbr": "—",
    "meaning": "合同开始产生法律约束力的条件",
    "usage": "Effective upon signing by both parties",
    "note": "有些合同约定收到订金才生效"
  },
  {
    "id": "02-43",
    "category": "02",
    "zh": "合同变更",
    "en": "Amendment to Contract",
    "abbr": "—",
    "meaning": "对已生效合同内容的修改",
    "usage": "Any amendment shall be in writing",
    "note": "口头变更难以举证"
  },
  {
    "id": "02-44",
    "category": "02",
    "zh": "合同解除",
    "en": "Termination of Contract",
    "abbr": "—",
    "meaning": "提前结束合同权利义务",
    "usage": "Termination for convenience with 30 days' notice",
    "note": "区分解除与终止的法律后果"
  },
  {
    "id": "02-45",
    "category": "02",
    "zh": "样品",
    "en": "Sample",
    "abbr": "—",
    "meaning": "用于确认质量、款式的小量货物",
    "usage": "Sample will be sent by DHL",
    "note": "样品费与运费承担要提前讲清"
  },
  {
    "id": "02-46",
    "category": "02",
    "zh": "大货",
    "en": "Bulk Production",
    "abbr": "—",
    "meaning": "按订单批量生产的产品",
    "usage": "Bulk production will start next week",
    "note": "大货与样品不一致是最常见纠纷"
  },
  {
    "id": "02-47",
    "category": "02",
    "zh": "首单",
    "en": "First Order",
    "abbr": "—",
    "meaning": "客户第一次下的订单",
    "usage": "We accept a small first order as a trial",
    "note": "首单常给价格优惠换长期合作"
  },
  {
    "id": "02-48",
    "category": "02",
    "zh": "试单",
    "en": "Trial Order",
    "abbr": "—",
    "meaning": "小批量试用订单",
    "usage": "Trial order of 500 pcs",
    "note": ""
  },
  {
    "id": "02-49",
    "category": "02",
    "zh": "翻单",
    "en": "Repeat Order",
    "abbr": "—",
    "meaning": "客户再次下的相同或类似订单",
    "usage": "We look forward to your repeat order",
    "note": ""
  },
  {
    "id": "02-50",
    "category": "02",
    "zh": "追加订单",
    "en": "Additional Order",
    "abbr": "—",
    "meaning": "在原订单基础上增加数量",
    "usage": "Additional order of 2,000 pcs",
    "note": "需重新确认交期与价格"
  },
  {
    "id": "02-51",
    "category": "02",
    "zh": "取消订单",
    "en": "Order Cancellation",
    "abbr": "—",
    "meaning": "买方或卖方撤销已下的订单",
    "usage": "Cancellation must be confirmed in writing",
    "note": "已投产的订单取消通常需赔偿"
  },
  {
    "id": "02-52",
    "category": "02",
    "zh": "订金",
    "en": "Deposit / Down Payment",
    "abbr": "—",
    "meaning": "合同签订后预付的部分货款",
    "usage": "30% deposit upon order confirmation",
    "note": "订金≠定金，法律性质不同"
  },
  {
    "id": "02-53",
    "category": "02",
    "zh": "尾款",
    "en": "Balance Payment",
    "abbr": "—",
    "meaning": "扣除预付款后剩余的货款",
    "usage": "Balance against copy of B/L",
    "note": "放单前务必确认到账"
  },
  {
    "id": "02-54",
    "category": "02",
    "zh": "交期确认",
    "en": "Delivery Confirmation",
    "abbr": "—",
    "meaning": "对交货时间的书面确认",
    "usage": "Please confirm the delivery date by return",
    "note": ""
  },
  {
    "id": "03-1",
    "category": "03",
    "zh": "成本",
    "en": "Cost",
    "abbr": "—",
    "meaning": "生产或采购商品所发生的全部支出",
    "usage": "We need to keep our cost under USD 8 per unit",
    "note": "核算成本时别漏了包装与内陆运费"
  },
  {
    "id": "03-2",
    "category": "03",
    "zh": "出厂价",
    "en": "Ex-works Price",
    "abbr": "EXW",
    "meaning": "不含运保费的工厂交货价格",
    "usage": "Ex-works price: USD 9.20/pc",
    "note": "客户常误当 FOB 价使用"
  },
  {
    "id": "03-3",
    "category": "03",
    "zh": "离岸价",
    "en": "FOB Price",
    "abbr": "—",
    "meaning": "装运港船上交货价，口语常指 FOB",
    "usage": "FOB price: USD 10.50/pc Shanghai",
    "note": "严格说 FOB 仅是术语，不是价格构成"
  },
  {
    "id": "03-4",
    "category": "03",
    "zh": "到岸价",
    "en": "CIF Price",
    "abbr": "—",
    "meaning": "成本加运费、保险费的价格，口语常用",
    "usage": "CIF price: USD 11.80/pc Rotterdam",
    "note": "CIF 并非'到岸'交风险，风险仍在装运港"
  },
  {
    "id": "03-5",
    "category": "03",
    "zh": "采购成本",
    "en": "Purchasing Cost",
    "abbr": "—",
    "meaning": "向工厂或供应商采购的价格",
    "usage": "Purchasing cost increased by 6% this year",
    "note": ""
  },
  {
    "id": "03-6",
    "category": "03",
    "zh": "原材料",
    "en": "Raw Material",
    "abbr": "—",
    "meaning": "生产所需的初级材料",
    "usage": "Raw material prices are volatile",
    "note": "报价时要约定调价机制"
  },
  {
    "id": "03-7",
    "category": "03",
    "zh": "人工成本",
    "en": "Labor Cost",
    "abbr": "—",
    "meaning": "支付给工人的工资与福利",
    "usage": "Labor cost in coastal provinces keeps rising",
    "note": ""
  },
  {
    "id": "03-8",
    "category": "03",
    "zh": "制造费用",
    "en": "Manufacturing Overhead",
    "abbr": "—",
    "meaning": "厂房、设备折旧、水电等间接费用",
    "usage": "Overhead accounts for 12% of total cost",
    "note": ""
  },
  {
    "id": "03-9",
    "category": "03",
    "zh": "包装费",
    "en": "Packing Cost",
    "abbr": "—",
    "meaning": "包装材料与人工费用",
    "usage": "Packing cost: USD 0.35 per carton",
    "note": "客户要求特殊包装时要单独报价"
  },
  {
    "id": "03-10",
    "category": "03",
    "zh": "内陆运费",
    "en": "Inland Freight",
    "abbr": "—",
    "meaning": "工厂到装运港或边境的运输费用",
    "usage": "Inland freight to Ningbo port",
    "note": ""
  },
  {
    "id": "03-11",
    "category": "03",
    "zh": "报关费",
    "en": "Customs Declaration Fee",
    "abbr": "—",
    "meaning": "报关行代办报关的服务费用",
    "usage": "Customs declaration fee: RMB 300 per shipment",
    "note": ""
  },
  {
    "id": "03-12",
    "category": "03",
    "zh": "港杂费",
    "en": "Port Charges",
    "abbr": "—",
    "meaning": "港口作业、装卸等杂项费用",
    "usage": "Port charges are included in the local charges",
    "note": "不同港口差异大"
  },
  {
    "id": "03-13",
    "category": "03",
    "zh": "订舱费",
    "en": "Booking Fee",
    "abbr": "—",
    "meaning": "向船公司预订舱位的费用",
    "usage": "Booking fee is waived for this shipment",
    "note": ""
  },
  {
    "id": "03-14",
    "category": "03",
    "zh": "文件费",
    "en": "Document Fee",
    "abbr": "—",
    "meaning": "签发提单等单据的费用",
    "usage": "Document fee: USD 35 per B/L",
    "note": "船公司常单独收取"
  },
  {
    "id": "03-15",
    "category": "03",
    "zh": "海运费",
    "en": "Ocean Freight",
    "abbr": "—",
    "meaning": "海上运输的费用",
    "usage": "Ocean freight has doubled since last year",
    "note": "运价波动大，报价须设有效期"
  },
  {
    "id": "03-16",
    "category": "03",
    "zh": "燃油附加费",
    "en": "Bunker Adjustment Factor",
    "abbr": "BAF",
    "meaning": "因燃油价格变动而加收的附加费",
    "usage": "BAF: USD 120 per 20GP",
    "note": "常与海运报价捆绑名目"
  },
  {
    "id": "03-17",
    "category": "03",
    "zh": "货币贬值附加费",
    "en": "Currency Adjustment Factor",
    "abbr": "CAF",
    "meaning": "因结算货币贬值而加收的附加费",
    "usage": "CAF applies at 3.5%",
    "note": ""
  },
  {
    "id": "03-18",
    "category": "03",
    "zh": "旺季附加费",
    "en": "Peak Season Surcharge",
    "abbr": "PSS",
    "meaning": "运输旺季临时加收的附加费",
    "usage": "PSS of USD 200/40HQ in August",
    "note": ""
  },
  {
    "id": "03-19",
    "category": "03",
    "zh": "码头操作费",
    "en": "Terminal Handling Charge",
    "abbr": "THC",
    "meaning": "港口码头装卸集装箱的费用",
    "usage": "THC: USD 150 per container",
    "note": "常被单独列在本地费用里"
  },
  {
    "id": "03-20",
    "category": "03",
    "zh": "保险费",
    "en": "Insurance Premium",
    "abbr": "—",
    "meaning": "投保货运险支付的费用",
    "usage": "Premium at 0.15% of insured value",
    "note": "费率与险别、航线有关"
  },
  {
    "id": "03-21",
    "category": "03",
    "zh": "佣金",
    "en": "Commission",
    "abbr": "—",
    "meaning": "按成交额一定比例支付给中间人的报酬",
    "usage": "3% commission on FOB value",
    "note": "明确佣金基数（FOB 还是 CIF）"
  },
  {
    "id": "03-22",
    "category": "03",
    "zh": "明佣",
    "en": "Open Commission",
    "abbr": "—",
    "meaning": "在合同中明示的佣金",
    "usage": "The price includes 3% open commission",
    "note": ""
  },
  {
    "id": "03-23",
    "category": "03",
    "zh": "暗佣",
    "en": "Hidden Commission",
    "abbr": "—",
    "meaning": "不在合同中明示、私下支付的佣金",
    "usage": "Hidden commission is paid after shipment",
    "note": "合规风险较高，慎用"
  },
  {
    "id": "03-24",
    "category": "03",
    "zh": "折扣",
    "en": "Discount",
    "abbr": "—",
    "meaning": "价格上的直接减让",
    "usage": "We can offer a 5% discount for orders over 10,000 pcs",
    "note": ""
  },
  {
    "id": "03-25",
    "category": "03",
    "zh": "回扣",
    "en": "Rebate",
    "abbr": "—",
    "meaning": "交易完成后按比例返还的部分货款",
    "usage": "Year-end rebate of 2%",
    "note": "与折扣的税务处理不同"
  },
  {
    "id": "03-26",
    "category": "03",
    "zh": "利润率",
    "en": "Profit Margin",
    "abbr": "—",
    "meaning": "利润占销售额的比例",
    "usage": "Our margin is only 8% on this item",
    "note": ""
  },
  {
    "id": "03-27",
    "category": "03",
    "zh": "加价率",
    "en": "Markup",
    "abbr": "—",
    "meaning": "售价相对成本的加价比例",
    "usage": "Markup of 25% over landed cost",
    "note": ""
  },
  {
    "id": "03-28",
    "category": "03",
    "zh": "换汇成本",
    "en": "Exchange Cost",
    "abbr": "—",
    "meaning": "每收入 1 单位外币所耗费的人民币成本，衡量出口盈亏",
    "usage": "Exchange cost of RMB 6.85 per USD",
    "note": "低于银行牌价才有汇兑收益"
  },
  {
    "id": "03-29",
    "category": "03",
    "zh": "出口退税",
    "en": "Export Tax Rebate",
    "abbr": "—",
    "meaning": "国家退还出口货物所含的增值税",
    "usage": "13% export tax rebate applies to this HS code",
    "note": "退税率随商品与政策调整"
  },
  {
    "id": "03-30",
    "category": "03",
    "zh": "汇率",
    "en": "Exchange Rate",
    "abbr": "—",
    "meaning": "两种货币之间的兑换比率",
    "usage": "At the current exchange rate of 7.12",
    "note": "报价应约定汇率波动幅度"
  },
  {
    "id": "03-31",
    "category": "03",
    "zh": "结汇",
    "en": "Settlement of Foreign Exchange",
    "abbr": "—",
    "meaning": "将外汇收入兑换为人民币",
    "usage": "We will settle the payment upon receipt",
    "note": ""
  },
  {
    "id": "03-32",
    "category": "03",
    "zh": "购汇",
    "en": "Purchase of Foreign Exchange",
    "abbr": "—",
    "meaning": "用人民币购买外汇对外支付",
    "usage": "We need to purchase USD for the payment",
    "note": ""
  },
  {
    "id": "03-33",
    "category": "03",
    "zh": "银行费用",
    "en": "Bank Charges",
    "abbr": "—",
    "meaning": "银行办理结算收取的手续费",
    "usage": "All bank charges outside China are for buyer's account",
    "note": "谁承担境外费用要写明"
  },
  {
    "id": "03-34",
    "category": "03",
    "zh": "电汇费",
    "en": "Wire Transfer Fee",
    "abbr": "—",
    "meaning": "电汇业务的手续费",
    "usage": "A USD 30 wire transfer fee applies",
    "note": ""
  },
  {
    "id": "03-35",
    "category": "03",
    "zh": "报价有效期",
    "en": "Quotation Validity",
    "abbr": "—",
    "meaning": "报价可被接受的时间范围",
    "usage": "This quotation is valid for 15 days",
    "note": "原材料波动大时缩短有效期"
  },
  {
    "id": "03-36",
    "category": "03",
    "zh": "涨价",
    "en": "Price Increase",
    "abbr": "—",
    "meaning": "提高售价",
    "usage": "We have to increase our price by 5% from July",
    "note": "提前书面通知客户"
  },
  {
    "id": "03-37",
    "category": "03",
    "zh": "降价",
    "en": "Price Reduction",
    "abbr": "—",
    "meaning": "降低售价",
    "usage": "We can reduce the price if the quantity doubles",
    "note": ""
  },
  {
    "id": "03-38",
    "category": "03",
    "zh": "价格战",
    "en": "Price War",
    "abbr": "—",
    "meaning": "同行之间竞相压价",
    "usage": "We avoid price wars by focusing on quality",
    "note": ""
  },
  {
    "id": "03-39",
    "category": "03",
    "zh": "成本核算",
    "en": "Cost Accounting",
    "abbr": "—",
    "meaning": "对各项成本进行归集与计算",
    "usage": "Cost accounting shows we lose money at this price",
    "note": "报价前必做"
  },
  {
    "id": "03-40",
    "category": "03",
    "zh": "落地成本",
    "en": "Landed Cost",
    "abbr": "—",
    "meaning": "货物抵达买方仓库的全部成本（含关税、运费）",
    "usage": "Landed cost in the US is USD 14.20",
    "note": "买方算账常用这个口径"
  },
  {
    "id": "04-1",
    "category": "04",
    "zh": "电汇",
    "en": "Telegraphic Transfer",
    "abbr": "T/T",
    "meaning": "通过银行电讯方式汇款的结算方式",
    "usage": "Payment by T/T",
    "note": "最常用；注意是汇入还是汇出"
  },
  {
    "id": "04-2",
    "category": "04",
    "zh": "预付货款",
    "en": "T/T in Advance",
    "abbr": "前T/T",
    "meaning": "买方在发货前先付款",
    "usage": "30% T/T in advance",
    "note": "卖方最安全，买方风险最大"
  },
  {
    "id": "04-3",
    "category": "04",
    "zh": "货到付款",
    "en": "T/T after Shipment",
    "abbr": "后T/T",
    "meaning": "货物出运后买方再付款",
    "usage": "70% T/T against copy of B/L",
    "note": "务必先收到款再放正本单据"
  },
  {
    "id": "04-4",
    "category": "04",
    "zh": "信用证",
    "en": "Letter of Credit",
    "abbr": "L/C",
    "meaning": "银行应买方申请开立、承诺凭符合单据付款的书面保证",
    "usage": "Payment by irrevocable L/C at sight",
    "note": "单证相符是付款前提"
  },
  {
    "id": "04-5",
    "category": "04",
    "zh": "即期信用证",
    "en": "Sight L/C",
    "abbr": "—",
    "meaning": "开证行见单即付款的信用证",
    "usage": "L/C at sight",
    "note": ""
  },
  {
    "id": "04-6",
    "category": "04",
    "zh": "远期信用证",
    "en": "Usance L/C",
    "abbr": "—",
    "meaning": "约定在未来某日付款的信用证",
    "usage": "L/C at 90 days after sight",
    "note": "买方融资，卖方承担资金占用"
  },
  {
    "id": "04-7",
    "category": "04",
    "zh": "不可撤销信用证",
    "en": "Irrevocable L/C",
    "abbr": "—",
    "meaning": "未经受益人同意不得修改或撤销",
    "usage": "Irrevocable L/C",
    "note": "UCP600 下默认即为不可撤销"
  },
  {
    "id": "04-8",
    "category": "04",
    "zh": "保兑信用证",
    "en": "Confirmed L/C",
    "abbr": "—",
    "meaning": "由另一家银行加具保兑的信用证",
    "usage": "L/C confirmed by a first-class bank",
    "note": "开证行资信差时要求保兑"
  },
  {
    "id": "04-9",
    "category": "04",
    "zh": "可转让信用证",
    "en": "Transferable L/C",
    "abbr": "—",
    "meaning": "受益人可将信用证权利转让给第二受益人",
    "usage": "Transferable L/C",
    "note": "中间商常用；只能转让一次"
  },
  {
    "id": "04-10",
    "category": "04",
    "zh": "循环信用证",
    "en": "Revolving L/C",
    "abbr": "—",
    "meaning": "在规定期间内可循环使用的信用证",
    "usage": "Revolving L/C for monthly shipments",
    "note": "适合长期分批供货"
  },
  {
    "id": "04-11",
    "category": "04",
    "zh": "对开信用证",
    "en": "Reciprocal L/C",
    "abbr": "—",
    "meaning": "买卖双方互相开立信用证",
    "usage": "Reciprocal L/C arrangement",
    "note": "来料加工、补偿贸易常用"
  },
  {
    "id": "04-12",
    "category": "04",
    "zh": "背对背信用证",
    "en": "Back-to-back L/C",
    "abbr": "—",
    "meaning": "以原信用证为担保开立的新信用证",
    "usage": "Back-to-back L/C",
    "note": "中间商赚差价常用"
  },
  {
    "id": "04-13",
    "category": "04",
    "zh": "备用信用证",
    "en": "Standby L/C",
    "abbr": "SBLC",
    "meaning": "只在申请人违约时才付款的信用证",
    "usage": "Standby L/C as performance guarantee",
    "note": "性质接近保函"
  },
  {
    "id": "04-14",
    "category": "04",
    "zh": "红条款信用证",
    "en": "Red Clause L/C",
    "abbr": "—",
    "meaning": "允许受益人在装运前预支款项的信用证",
    "usage": "Red clause L/C for raw material purchase",
    "note": "卖方风险较低，买方风险高"
  },
  {
    "id": "04-15",
    "category": "04",
    "zh": "假远期信用证",
    "en": "Usance L/C Payable at Sight",
    "abbr": "—",
    "meaning": "名义远期、实际即期付款的信用证",
    "usage": "Usance L/C payable at sight",
    "note": "贴现息由买方承担"
  },
  {
    "id": "04-16",
    "category": "04",
    "zh": "可撤销信用证",
    "en": "Revocable L/C",
    "abbr": "—",
    "meaning": "开证行可随时修改或撤销的信用证",
    "usage": "Revocable L/C is rarely used",
    "note": "对受益人保护极弱，实务中基本不用"
  },
  {
    "id": "04-17",
    "category": "04",
    "zh": "开证申请人",
    "en": "Applicant",
    "abbr": "—",
    "meaning": "向银行申请开立信用证的一方，通常是买方",
    "usage": "Applicant: ABC Trading Co., Ltd.",
    "note": ""
  },
  {
    "id": "04-18",
    "category": "04",
    "zh": "受益人",
    "en": "Beneficiary",
    "abbr": "—",
    "meaning": "有权凭信用证支取款项的一方，通常是卖方",
    "usage": "Beneficiary: XYZ Industrial Co., Ltd.",
    "note": ""
  },
  {
    "id": "04-19",
    "category": "04",
    "zh": "开证行",
    "en": "Issuing Bank",
    "abbr": "—",
    "meaning": "应申请人要求开立信用证的银行",
    "usage": "Issuing Bank: Bank of China, Shanghai Branch",
    "note": "开证行的资信直接决定收款安全"
  },
  {
    "id": "04-20",
    "category": "04",
    "zh": "通知行",
    "en": "Advising Bank",
    "abbr": "—",
    "meaning": "受开证行委托将信用证通知受益人的银行",
    "usage": "Advising Bank: HSBC Hong Kong",
    "note": "通知行不承担付款责任"
  },
  {
    "id": "04-21",
    "category": "04",
    "zh": "议付行",
    "en": "Negotiating Bank",
    "abbr": "—",
    "meaning": "买入受益人汇票与单据的银行",
    "usage": "Negotiating Bank: Citibank N.A.",
    "note": ""
  },
  {
    "id": "04-22",
    "category": "04",
    "zh": "保兑行",
    "en": "Confirming Bank",
    "abbr": "—",
    "meaning": "在信用证上加具保兑、承担付款责任的银行",
    "usage": "Confirming Bank: DBS Bank",
    "note": ""
  },
  {
    "id": "04-23",
    "category": "04",
    "zh": "付款行",
    "en": "Paying Bank",
    "abbr": "—",
    "meaning": "信用证指定的付款银行",
    "usage": "Paying Bank: Bank of America",
    "note": ""
  },
  {
    "id": "04-24",
    "category": "04",
    "zh": "偿付行",
    "en": "Reimbursing Bank",
    "abbr": "—",
    "meaning": "代开证行向议付行偿付的银行",
    "usage": "Reimbursing Bank: JPMorgan Chase",
    "note": ""
  },
  {
    "id": "04-25",
    "category": "04",
    "zh": "开证申请书",
    "en": "Application for L/C",
    "abbr": "—",
    "meaning": "申请人向开证行提交的开证申请文件",
    "usage": "Please complete the L/C application form",
    "note": "申请书内容与合同不一致会导致后续麻烦"
  },
  {
    "id": "04-26",
    "category": "04",
    "zh": "信用证修改",
    "en": "L/C Amendment",
    "abbr": "—",
    "meaning": "对已开立信用证条款的变更",
    "usage": "Please amend the L/C to allow transshipment",
    "note": "修改须经受益人接受才生效"
  },
  {
    "id": "04-27",
    "category": "04",
    "zh": "软条款",
    "en": "Soft Clause",
    "abbr": "—",
    "meaning": "使开证行付款取决于申请人行为的条款",
    "usage": "A soft clause requiring buyer's inspection certificate",
    "note": "典型陷阱，应要求删除"
  },
  {
    "id": "04-28",
    "category": "04",
    "zh": "不符点",
    "en": "Discrepancy",
    "abbr": "—",
    "meaning": "单据与信用证条款不一致之处",
    "usage": "One discrepancy: late shipment",
    "note": "一个不符点就可能被拒付"
  },
  {
    "id": "04-29",
    "category": "04",
    "zh": "交单",
    "en": "Presentation",
    "abbr": "—",
    "meaning": "受益人向银行提交单据的行为",
    "usage": "Documents presented on 10 June",
    "note": "注意交单期与有效期"
  },
  {
    "id": "04-30",
    "category": "04",
    "zh": "交单期",
    "en": "Presentation Period",
    "abbr": "—",
    "meaning": "装运后必须交单的期限",
    "usage": "Documents to be presented within 21 days after shipment",
    "note": "UCP600 默认 21 天"
  },
  {
    "id": "04-31",
    "category": "04",
    "zh": "有效期",
    "en": "Expiry Date",
    "abbr": "—",
    "meaning": "信用证失效的日期",
    "usage": "Expiry date: 30 June 2026 in China",
    "note": "注意到期地点在何处"
  },
  {
    "id": "04-32",
    "category": "04",
    "zh": "最迟装运期",
    "en": "Latest Shipment Date",
    "abbr": "—",
    "meaning": "允许装运的最后日期",
    "usage": "Latest shipment date: 10 June 2026",
    "note": "晚于该日装运即为不符点"
  },
  {
    "id": "04-33",
    "category": "04",
    "zh": "双到期",
    "en": "Dual Expiry",
    "abbr": "—",
    "meaning": "最迟装运期与信用证有效期同日",
    "usage": "Dual expiry leaves no time to correct documents",
    "note": "尽量避免，改单时间不足"
  },
  {
    "id": "04-34",
    "category": "04",
    "zh": "议付",
    "en": "Negotiation",
    "abbr": "—",
    "meaning": "银行购买受益人汇票及单据的行为",
    "usage": "Negotiation under the L/C",
    "note": "议付行有追索权"
  },
  {
    "id": "04-35",
    "category": "04",
    "zh": "承兑",
    "en": "Acceptance",
    "abbr": "—",
    "meaning": "付款人对远期汇票承诺到期付款",
    "usage": "Draft accepted by the issuing bank",
    "note": ""
  },
  {
    "id": "04-36",
    "category": "04",
    "zh": "贴现",
    "en": "Discount",
    "abbr": "—",
    "meaning": "提前取得未到期票据款项、扣除利息",
    "usage": "The bank discounted the usance draft",
    "note": ""
  },
  {
    "id": "04-37",
    "category": "04",
    "zh": "延期付款",
    "en": "Deferred Payment",
    "abbr": "—",
    "meaning": "约定在未来日期付款的信用证结算方式",
    "usage": "Deferred payment at 60 days after B/L date",
    "note": ""
  },
  {
    "id": "04-38",
    "category": "04",
    "zh": "全套单据",
    "en": "Full Set of Documents",
    "abbr": "—",
    "meaning": "信用证要求的全部单据",
    "usage": "Full set of clean on board B/L",
    "note": "缺一不可"
  },
  {
    "id": "04-39",
    "category": "04",
    "zh": "正本",
    "en": "Original",
    "abbr": "—",
    "meaning": "具有法律效力的原始单据",
    "usage": "Three originals of the B/L",
    "note": "注意'全套正本'是几份"
  },
  {
    "id": "04-40",
    "category": "04",
    "zh": "副本",
    "en": "Copy",
    "abbr": "—",
    "meaning": "非原始的单据复制件",
    "usage": "Copy of invoice",
    "note": ""
  },
  {
    "id": "04-41",
    "category": "04",
    "zh": "背书",
    "en": "Endorsement",
    "abbr": "—",
    "meaning": "在票据或提单背面签字转让权利",
    "usage": "B/L endorsed in blank",
    "note": ""
  },
  {
    "id": "04-42",
    "category": "04",
    "zh": "空白背书",
    "en": "Blank Endorsement",
    "abbr": "—",
    "meaning": "仅签字不指定受让人的背书",
    "usage": "Endorsed in blank",
    "note": "凭此可自由转让"
  },
  {
    "id": "04-43",
    "category": "04",
    "zh": "汇票",
    "en": "Bill of Exchange",
    "abbr": "Draft",
    "meaning": "出票人签发、委托付款人见票付款的票据",
    "usage": "Draft at 90 days after sight",
    "note": "注意出票条款与信用证一致"
  },
  {
    "id": "04-44",
    "category": "04",
    "zh": "本票",
    "en": "Promissory Note",
    "abbr": "—",
    "meaning": "出票人承诺自己付款的票据",
    "usage": "Promissory note issued by the buyer",
    "note": ""
  },
  {
    "id": "04-45",
    "category": "04",
    "zh": "支票",
    "en": "Cheque",
    "abbr": "—",
    "meaning": "委托银行见票付款的票据",
    "usage": "Cheque payable to the order of...",
    "note": "国际贸易中较少使用"
  },
  {
    "id": "04-46",
    "category": "04",
    "zh": "出票人",
    "en": "Drawer",
    "abbr": "—",
    "meaning": "签发汇票的人，通常是卖方",
    "usage": "The drawer is the exporter",
    "note": ""
  },
  {
    "id": "04-47",
    "category": "04",
    "zh": "受票人",
    "en": "Drawee",
    "abbr": "—",
    "meaning": "汇票指向的付款人",
    "usage": "The drawee is the issuing bank",
    "note": ""
  },
  {
    "id": "04-48",
    "category": "04",
    "zh": "收款人",
    "en": "Payee",
    "abbr": "—",
    "meaning": "汇票金额的收取人",
    "usage": "Payee: XYZ Industrial Co., Ltd.",
    "note": ""
  },
  {
    "id": "04-49",
    "category": "04",
    "zh": "托收",
    "en": "Collection",
    "abbr": "—",
    "meaning": "卖方委托银行向买方收取货款的结算方式",
    "usage": "Payment by documentary collection",
    "note": "银行不承担付款责任"
  },
  {
    "id": "04-50",
    "category": "04",
    "zh": "付款交单",
    "en": "Documents against Payment",
    "abbr": "D/P",
    "meaning": "买方付款后才交出单据",
    "usage": "D/P at sight",
    "note": "比 D/A 安全，但仍有拒付风险"
  },
  {
    "id": "04-51",
    "category": "04",
    "zh": "承兑交单",
    "en": "Documents against Acceptance",
    "abbr": "D/A",
    "meaning": "买方承兑汇票后即可取得单据",
    "usage": "D/A at 60 days",
    "note": "风险高，慎用于新客户"
  },
  {
    "id": "04-52",
    "category": "04",
    "zh": "赊销",
    "en": "Open Account",
    "abbr": "O/A",
    "meaning": "先发货、后按约定期限付款",
    "usage": "O/A 60 days",
    "note": "风险最高，建议配合信用保险"
  },
  {
    "id": "04-53",
    "category": "04",
    "zh": "预付款",
    "en": "Advance Payment",
    "abbr": "—",
    "meaning": "合同履行前支付的款项",
    "usage": "20% advance payment",
    "note": ""
  },
  {
    "id": "04-54",
    "category": "04",
    "zh": "分期付款",
    "en": "Installment",
    "abbr": "—",
    "meaning": "分多次支付货款",
    "usage": "Payment in three installments",
    "note": ""
  },
  {
    "id": "04-55",
    "category": "04",
    "zh": "国际保理",
    "en": "International Factoring",
    "abbr": "—",
    "meaning": "保理商买断应收账款并提供融资与催收",
    "usage": "Factoring facility with a local bank",
    "note": "适合 O/A 结算"
  },
  {
    "id": "04-56",
    "category": "04",
    "zh": "福费廷",
    "en": "Forfaiting",
    "abbr": "—",
    "meaning": "无追索权地买断远期票据",
    "usage": "Forfaiting of the usance L/C receivables",
    "note": ""
  },
  {
    "id": "04-57",
    "category": "04",
    "zh": "银行保函",
    "en": "Letter of Guarantee",
    "abbr": "L/G",
    "meaning": "银行出具的担保付款或履约的书面承诺",
    "usage": "Performance L/G of 10% contract value",
    "note": "与备用信用证功能相近"
  },
  {
    "id": "04-58",
    "category": "04",
    "zh": "提货担保",
    "en": "Shipping Guarantee",
    "abbr": "—",
    "meaning": "货物先到、单据未到时凭担保提货",
    "usage": "Shipping guarantee issued by the bank",
    "note": "须及时补交正本提单"
  },
  {
    "id": "04-59",
    "category": "04",
    "zh": "跟单信用证统一惯例",
    "en": "UCP 600",
    "abbr": "UCP600",
    "meaning": "国际商会制定的信用证业务规则",
    "usage": "This L/C is subject to UCP 600",
    "note": "ICC 出版物第 600 号"
  },
  {
    "id": "04-60",
    "category": "04",
    "zh": "国际标准银行实务",
    "en": "ISBP",
    "abbr": "ISBP",
    "meaning": "UCP 的配套审单实务指引",
    "usage": "Documents examined per ISBP 745",
    "note": "审单争议时的重要依据"
  },
  {
    "id": "04-61",
    "category": "04",
    "zh": "SWIFT",
    "en": "Society for Worldwide Interbank Financial Telecommunication",
    "abbr": "SWIFT",
    "meaning": "全球银行间金融电讯网络",
    "usage": "L/C advised by SWIFT MT700",
    "note": "信用证报文格式 MT700/MT707"
  },
  {
    "id": "04-62",
    "category": "04",
    "zh": "密押",
    "en": "Test Key",
    "abbr": "—",
    "meaning": "银行间验证电文真实性的密码",
    "usage": "Please verify the test key",
    "note": ""
  },
  {
    "id": "04-63",
    "category": "04",
    "zh": "催证",
    "en": "Urging L/C",
    "abbr": "—",
    "meaning": "催促买方尽快开立信用证",
    "usage": "We have to urge the L/C as the shipment date is approaching",
    "note": ""
  },
  {
    "id": "04-64",
    "category": "04",
    "zh": "改证",
    "en": "L/C Amendment",
    "abbr": "—",
    "meaning": "要求修改信用证条款",
    "usage": "Please amend the L/C as follows",
    "note": ""
  },
  {
    "id": "04-65",
    "category": "04",
    "zh": "展证",
    "en": "Extension of L/C",
    "abbr": "—",
    "meaning": "延长信用证有效期或装运期",
    "usage": "We request a 15-day extension of the L/C",
    "note": ""
  },
  {
    "id": "05-1",
    "category": "05",
    "zh": "包装",
    "en": "Packing",
    "abbr": "—",
    "meaning": "为保护商品、便于运输而进行的包装作业",
    "usage": "Export packing must withstand long sea voyage",
    "note": ""
  },
  {
    "id": "05-2",
    "category": "05",
    "zh": "运输包装",
    "en": "Outer Packing",
    "abbr": "—",
    "meaning": "用于运输、保护商品的外层包装",
    "usage": "Outer packing: 5-ply corrugated carton",
    "note": ""
  },
  {
    "id": "05-3",
    "category": "05",
    "zh": "销售包装",
    "en": "Inner Packing",
    "abbr": "—",
    "meaning": "直接接触商品、面向消费者的包装",
    "usage": "Inner packing: color box with barcode",
    "note": ""
  },
  {
    "id": "05-4",
    "category": "05",
    "zh": "中性包装",
    "en": "Neutral Packing",
    "abbr": "—",
    "meaning": "不标明产地、厂名的包装",
    "usage": "Neutral packing without any Chinese marks",
    "note": "注意进口国原产地标识要求"
  },
  {
    "id": "05-5",
    "category": "05",
    "zh": "定牌包装",
    "en": "Brand Designated Packing",
    "abbr": "—",
    "meaning": "按买方指定品牌制作的包装",
    "usage": "Brand designated packing per your artwork",
    "note": "需买方提供商标授权"
  },
  {
    "id": "05-6",
    "category": "05",
    "zh": "无牌包装",
    "en": "Unbranded Packing",
    "abbr": "—",
    "meaning": "不标注任何品牌的包装",
    "usage": "Unbranded packing for wholesale market",
    "note": ""
  },
  {
    "id": "05-7",
    "category": "05",
    "zh": "纸箱",
    "en": "Carton",
    "abbr": "—",
    "meaning": "纸质包装箱，最常用的运输包装",
    "usage": "20 pcs per carton",
    "note": "注明层数（3层/5层）与承重"
  },
  {
    "id": "05-8",
    "category": "05",
    "zh": "木箱",
    "en": "Wooden Case",
    "abbr": "—",
    "meaning": "木质包装箱，用于重型或精密设备",
    "usage": "Packed in wooden cases",
    "note": "木质包装须符合 ISPM 15"
  },
  {
    "id": "05-9",
    "category": "05",
    "zh": "托盘",
    "en": "Pallet",
    "abbr": "—",
    "meaning": "便于叉车装卸的承载平台",
    "usage": "1,200 × 1,000 mm pallet",
    "note": "注明托盘材质与是否可回收"
  },
  {
    "id": "05-10",
    "category": "05",
    "zh": "托盘化",
    "en": "Palletization",
    "abbr": "—",
    "meaning": "将货物码放在托盘上整体运输",
    "usage": "Palletized shipment, 20 cartons per pallet",
    "note": ""
  },
  {
    "id": "05-11",
    "category": "05",
    "zh": "集装箱",
    "en": "Container",
    "abbr": "—",
    "meaning": "标准化的大型运输容器",
    "usage": "Goods stuffed into a 40HQ container",
    "note": ""
  },
  {
    "id": "05-12",
    "category": "05",
    "zh": "20 尺普柜",
    "en": "20-foot General Purpose Container",
    "abbr": "20GP",
    "meaning": "内径约 33 CBM 的标准集装箱",
    "usage": "One 20GP holds about 28 CBM of cargo",
    "note": "实际可装量受货物形态影响"
  },
  {
    "id": "05-13",
    "category": "05",
    "zh": "40 尺普柜",
    "en": "40-foot General Purpose Container",
    "abbr": "40GP",
    "meaning": "内径约 67 CBM 的标准集装箱",
    "usage": "Two 40GP containers",
    "note": ""
  },
  {
    "id": "05-14",
    "category": "05",
    "zh": "40 尺高柜",
    "en": "40-foot High Cube Container",
    "abbr": "40HQ",
    "meaning": "比普柜高 30cm，约 76 CBM",
    "usage": "One 40HQ container",
    "note": "轻泡货首选"
  },
  {
    "id": "05-15",
    "category": "05",
    "zh": "捆",
    "en": "Bale",
    "abbr": "—",
    "meaning": "将货物捆扎成件的包装单位",
    "usage": "Packed in bales of 100 kg",
    "note": "常见于棉花、废纸等"
  },
  {
    "id": "05-16",
    "category": "05",
    "zh": "桶",
    "en": "Drum",
    "abbr": "—",
    "meaning": "圆柱形容器，用于液体或粉体",
    "usage": "Packed in 200L iron drums",
    "note": "危险品须用 UN 认证包装"
  },
  {
    "id": "05-17",
    "category": "05",
    "zh": "袋",
    "en": "Bag / Sack",
    "abbr": "—",
    "meaning": "袋装包装单位",
    "usage": "25 kg per PP bag",
    "note": ""
  },
  {
    "id": "05-18",
    "category": "05",
    "zh": "卷",
    "en": "Roll",
    "abbr": "—",
    "meaning": "卷状包装单位",
    "usage": "Each roll is 50 meters",
    "note": ""
  },
  {
    "id": "05-19",
    "category": "05",
    "zh": "裸装",
    "en": "Nude Packing",
    "abbr": "—",
    "meaning": "不加包装、仅作必要防护的货物",
    "usage": "Nude packing for steel plates",
    "note": ""
  },
  {
    "id": "05-20",
    "category": "05",
    "zh": "散装",
    "en": "Bulk Cargo",
    "abbr": "—",
    "meaning": "不加包装、散装运输的货物",
    "usage": "Bulk cargo such as grain or ore",
    "note": ""
  },
  {
    "id": "05-21",
    "category": "05",
    "zh": "唛头",
    "en": "Shipping Marks",
    "abbr": "—",
    "meaning": "印在包装上便于识别的运输标志",
    "usage": "Shipping marks as per buyer's instruction",
    "note": "与单据必须完全一致"
  },
  {
    "id": "05-22",
    "category": "05",
    "zh": "正唛",
    "en": "Main Mark",
    "abbr": "—",
    "meaning": "包装正面标明收货人、目的地的主要标志",
    "usage": "Main mark: ABC / Hamburg / 1-50",
    "note": "件号连续编号很重要"
  },
  {
    "id": "05-23",
    "category": "05",
    "zh": "侧唛",
    "en": "Side Mark",
    "abbr": "—",
    "meaning": "包装侧面标明品名、规格、数量的标志",
    "usage": "Side mark: item no., qty, G.W., N.W.",
    "note": ""
  },
  {
    "id": "05-24",
    "category": "05",
    "zh": "指示性标志",
    "en": "Indicative Mark",
    "abbr": "—",
    "meaning": "提示搬运注意事项的图形标志",
    "usage": "Indicative marks: this side up, keep dry",
    "note": ""
  },
  {
    "id": "05-25",
    "category": "05",
    "zh": "警告性标志",
    "en": "Warning Mark",
    "abbr": "—",
    "meaning": "提示危险性的图形与文字标志",
    "usage": "Warning mark: flammable liquid",
    "note": "危险品必须符合 IMDG 规则"
  },
  {
    "id": "05-26",
    "category": "05",
    "zh": "条形码",
    "en": "Barcode",
    "abbr": "—",
    "meaning": "供扫描识别的编码标识",
    "usage": "EAN-13 barcode on each retail box",
    "note": "客户条码要求需提前确认"
  },
  {
    "id": "05-27",
    "category": "05",
    "zh": "标签",
    "en": "Label",
    "abbr": "—",
    "meaning": "标明产品信息的粘贴标识",
    "usage": "Care label and composition label required",
    "note": "欧美对标签内容有强制规定"
  },
  {
    "id": "05-28",
    "category": "05",
    "zh": "吊牌",
    "en": "Hangtag",
    "abbr": "—",
    "meaning": "挂在商品上的标识牌",
    "usage": "Hangtag with your logo",
    "note": ""
  },
  {
    "id": "05-29",
    "category": "05",
    "zh": "毛重",
    "en": "Gross Weight",
    "abbr": "G.W.",
    "meaning": "货物连同包装的总重量",
    "usage": "G.W.: 22.5 kg per carton",
    "note": "提单、装箱单上的重量口径"
  },
  {
    "id": "05-30",
    "category": "05",
    "zh": "净重",
    "en": "Net Weight",
    "abbr": "N.W.",
    "meaning": "扣除包装后的货物实际重量",
    "usage": "N.W.: 20 kg per carton",
    "note": ""
  },
  {
    "id": "05-31",
    "category": "05",
    "zh": "皮重",
    "en": "Tare Weight",
    "abbr": "—",
    "meaning": "包装本身的重量",
    "usage": "Tare weight: 2.5 kg",
    "note": ""
  },
  {
    "id": "05-32",
    "category": "05",
    "zh": "体积",
    "en": "Measurement",
    "abbr": "CBM",
    "meaning": "货物占据的空间体积，立方米",
    "usage": "Total measurement: 28.6 CBM",
    "note": "轻泡货按体积计费"
  },
  {
    "id": "05-33",
    "category": "05",
    "zh": "件数",
    "en": "Number of Packages",
    "abbr": "Pkgs",
    "meaning": "包装单位的总数量",
    "usage": "Total: 250 cartons",
    "note": "与提单、装箱单保持一致"
  },
  {
    "id": "05-34",
    "category": "05",
    "zh": "熏蒸",
    "en": "Fumigation",
    "abbr": "—",
    "meaning": "用化学药剂杀灭木质包装中有害生物",
    "usage": "Fumigation certificate required for wooden pallets",
    "note": "出口美、澳、欧盟常强制要求"
  },
  {
    "id": "05-35",
    "category": "05",
    "zh": "木质包装标识",
    "en": "IPPC Mark",
    "abbr": "IPPC",
    "meaning": "国际植物保护公约规定的木质包装处理标识",
    "usage": "All wooden pallets must bear the IPPC mark",
    "note": "无标识可能被退运"
  },
  {
    "id": "05-36",
    "category": "05",
    "zh": "防潮",
    "en": "Damp-proof",
    "abbr": "—",
    "meaning": "防止货物受潮的包装措施",
    "usage": "Damp-proof packing with desiccant",
    "note": ""
  },
  {
    "id": "05-37",
    "category": "05",
    "zh": "防震",
    "en": "Shock-proof",
    "abbr": "—",
    "meaning": "防止运输中震动损坏的包装措施",
    "usage": "Shock-proof foam inside the carton",
    "note": ""
  },
  {
    "id": "05-38",
    "category": "05",
    "zh": "易碎品",
    "en": "Fragile Goods",
    "abbr": "—",
    "meaning": "容易破损、需特殊搬运的货物",
    "usage": "Marked as fragile goods",
    "note": ""
  },
  {
    "id": "05-39",
    "category": "05",
    "zh": "装箱单",
    "en": "Packing List",
    "abbr": "P/L",
    "meaning": "列明每件包装内容、重量、体积的单据",
    "usage": "Packing list showing carton dimensions",
    "note": "与发票、提单三单一致"
  },
  {
    "id": "06-1",
    "category": "06",
    "zh": "运输",
    "en": "Transportation",
    "abbr": "—",
    "meaning": "货物从一地运至另一地的过程",
    "usage": "Transportation by sea is the most economical",
    "note": ""
  },
  {
    "id": "06-2",
    "category": "06",
    "zh": "海运",
    "en": "Ocean Freight",
    "abbr": "—",
    "meaning": "通过海上船舶运输货物",
    "usage": "Shipment by sea",
    "note": "大宗货首选"
  },
  {
    "id": "06-3",
    "category": "06",
    "zh": "空运",
    "en": "Air Freight",
    "abbr": "—",
    "meaning": "通过航空器运输货物",
    "usage": "Air freight for urgent orders",
    "note": "成本高、时效快"
  },
  {
    "id": "06-4",
    "category": "06",
    "zh": "陆运",
    "en": "Land Transport",
    "abbr": "—",
    "meaning": "通过公路或铁路运输",
    "usage": "Land transport to the border",
    "note": "边境贸易常用"
  },
  {
    "id": "06-5",
    "category": "06",
    "zh": "铁路运输",
    "en": "Rail Transport",
    "abbr": "—",
    "meaning": "通过铁路运输货物",
    "usage": "China-Europe Railway Express",
    "note": "中欧班列近年增长快"
  },
  {
    "id": "06-6",
    "category": "06",
    "zh": "整箱",
    "en": "Full Container Load",
    "abbr": "FCL",
    "meaning": "一个集装箱由一个货主使用",
    "usage": "FCL shipment, 1 × 40HQ",
    "note": "单箱成本低"
  },
  {
    "id": "06-7",
    "category": "06",
    "zh": "拼箱",
    "en": "Less than Container Load",
    "abbr": "LCL",
    "meaning": "多个货主的货物拼装在一个集装箱内",
    "usage": "LCL shipment, 8 CBM",
    "note": "注意拼箱的拆箱费"
  },
  {
    "id": "06-8",
    "category": "06",
    "zh": "件杂货",
    "en": "General Cargo",
    "abbr": "—",
    "meaning": "有包装、按件计量的货物",
    "usage": "General cargo vessel",
    "note": ""
  },
  {
    "id": "06-9",
    "category": "06",
    "zh": "订舱",
    "en": "Booking",
    "abbr": "—",
    "meaning": "向船公司预订舱位",
    "usage": "Space booking confirmed",
    "note": "旺季需提前 2-3 周"
  },
  {
    "id": "06-10",
    "category": "06",
    "zh": "舱位",
    "en": "Shipping Space",
    "abbr": "—",
    "meaning": "船上可供装载货物的位置",
    "usage": "No space available until next month",
    "note": ""
  },
  {
    "id": "06-11",
    "category": "06",
    "zh": "截关",
    "en": "Closing Time",
    "abbr": "—",
    "meaning": "货物必须完成报关放行的最后时限",
    "usage": "Closing time: 3 days before ETD",
    "note": "错过截关只能走下一班船"
  },
  {
    "id": "06-12",
    "category": "06",
    "zh": "截港",
    "en": "Cut-off Time",
    "abbr": "—",
    "meaning": "集装箱必须进港的最后时限",
    "usage": "Cut-off: 24 hours before vessel departure",
    "note": "与截关时间不同，别混淆"
  },
  {
    "id": "06-13",
    "category": "06",
    "zh": "装船",
    "en": "Shipment / Loading",
    "abbr": "—",
    "meaning": "将货物装上船舶",
    "usage": "Cargo loaded on board on 12 June",
    "note": ""
  },
  {
    "id": "06-14",
    "category": "06",
    "zh": "卸货",
    "en": "Discharge",
    "abbr": "—",
    "meaning": "将货物从船舶卸下",
    "usage": "Discharged at Hamburg",
    "note": ""
  },
  {
    "id": "06-15",
    "category": "06",
    "zh": "转运",
    "en": "Transshipment",
    "abbr": "—",
    "meaning": "货物在中途港换装另一船舶",
    "usage": "Transshipment at Singapore",
    "note": "信用证未允许转运时须改证"
  },
  {
    "id": "06-16",
    "category": "06",
    "zh": "直达",
    "en": "Direct",
    "abbr": "—",
    "meaning": "不经中途换装的运输",
    "usage": "Direct vessel to Rotterdam",
    "note": ""
  },
  {
    "id": "06-17",
    "category": "06",
    "zh": "分批装运",
    "en": "Partial Shipment",
    "abbr": "—",
    "meaning": "一笔交易分若干批装运",
    "usage": "Partial shipment allowed",
    "note": "信用证须明确允许"
  },
  {
    "id": "06-18",
    "category": "06",
    "zh": "装运通知",
    "en": "Shipping Advice",
    "abbr": "—",
    "meaning": "装运后通知买方船名、日期等信息",
    "usage": "Shipping advice sent upon shipment",
    "note": "合同常约定 48 小时内发出"
  },
  {
    "id": "06-19",
    "category": "06",
    "zh": "提单",
    "en": "Bill of Lading",
    "abbr": "B/L",
    "meaning": "承运人签发的货物收据、运输合同证明与物权凭证",
    "usage": "Original B/L in triplicate",
    "note": "三项功能缺一不可理解"
  },
  {
    "id": "06-20",
    "category": "06",
    "zh": "海运提单",
    "en": "Ocean Bill of Lading",
    "abbr": "—",
    "meaning": "海运方式下签发的提单",
    "usage": "Ocean B/L issued by Maersk",
    "note": ""
  },
  {
    "id": "06-21",
    "category": "06",
    "zh": "空运单",
    "en": "Air Waybill",
    "abbr": "AWB",
    "meaning": "航空运输的单据，非物权凭证",
    "usage": "AWB No. 999-12345678",
    "note": "收货人凭身份提货，不凭单放货"
  },
  {
    "id": "06-22",
    "category": "06",
    "zh": "海运单",
    "en": "Sea Waybill",
    "abbr": "—",
    "meaning": "不可转让的海运单据",
    "usage": "Sea waybill for express release",
    "note": "收货人凭身份提货"
  },
  {
    "id": "06-23",
    "category": "06",
    "zh": "铁路运单",
    "en": "Rail Waybill",
    "abbr": "—",
    "meaning": "铁路运输的单据",
    "usage": "CIM rail waybill",
    "note": "同样非物权凭证"
  },
  {
    "id": "06-24",
    "category": "06",
    "zh": "电放",
    "en": "Telex Release",
    "abbr": "—",
    "meaning": "凭发货人授权电放货物，无需正本提单",
    "usage": "Please arrange telex release",
    "note": "务必先收到货款再电放"
  },
  {
    "id": "06-25",
    "category": "06",
    "zh": "正本提单",
    "en": "Original B/L",
    "abbr": "—",
    "meaning": "具有物权凭证效力的原始提单",
    "usage": "Surrender original B/L to the bank",
    "note": "一般一式三份"
  },
  {
    "id": "06-26",
    "category": "06",
    "zh": "记名提单",
    "en": "Straight B/L",
    "abbr": "—",
    "meaning": "收货人栏写明具体公司的提单",
    "usage": "Straight B/L consigned to ABC Co.",
    "note": "不可转让"
  },
  {
    "id": "06-27",
    "category": "06",
    "zh": "指示提单",
    "en": "Order B/L",
    "abbr": "—",
    "meaning": "收货人栏写'凭指示'的提单",
    "usage": "Order B/L endorsed in blank",
    "note": "最常见、可转让"
  },
  {
    "id": "06-28",
    "category": "06",
    "zh": "不记名提单",
    "en": "Bearer B/L",
    "abbr": "—",
    "meaning": "收货人栏写'持单人'的提单",
    "usage": "Bearer B/L",
    "note": "风险高，极少使用"
  },
  {
    "id": "06-29",
    "category": "06",
    "zh": "清洁提单",
    "en": "Clean B/L",
    "abbr": "—",
    "meaning": "未批注货物或包装不良的提单",
    "usage": "Clean on board B/L",
    "note": "信用证通常要求清洁提单"
  },
  {
    "id": "06-30",
    "category": "06",
    "zh": "不清洁提单",
    "en": "Unclean B/L",
    "abbr": "—",
    "meaning": "批注了货物或包装缺陷的提单",
    "usage": "Unclean B/L rejected by the bank",
    "note": "银行一般不接受"
  },
  {
    "id": "06-31",
    "category": "06",
    "zh": "备运提单",
    "en": "Received for Shipment B/L",
    "abbr": "—",
    "meaning": "货物收妥待运但尚未装船时签发的提单",
    "usage": "Received for shipment B/L",
    "note": "信用证常要求已装船提单"
  },
  {
    "id": "06-32",
    "category": "06",
    "zh": "联运提单",
    "en": "Combined Transport B/L",
    "abbr": "—",
    "meaning": "覆盖多种运输方式的提单",
    "usage": "Combined transport B/L",
    "note": ""
  },
  {
    "id": "06-33",
    "category": "06",
    "zh": "转船提单",
    "en": "Transshipment B/L",
    "abbr": "—",
    "meaning": "注明货物将在中途港转运的提单",
    "usage": "Transshipment B/L",
    "note": ""
  },
  {
    "id": "06-34",
    "category": "06",
    "zh": "倒签提单",
    "en": "Ante-dated B/L",
    "abbr": "—",
    "meaning": "将签发日期提前至实际装船日之前的提单",
    "usage": "Ante-dating is illegal",
    "note": "属欺诈行为，严重违法"
  },
  {
    "id": "06-35",
    "category": "06",
    "zh": "预借提单",
    "en": "Advanced B/L",
    "abbr": "—",
    "meaning": "货物尚未装船即签发的提单",
    "usage": "Advancing the B/L date is prohibited",
    "note": "同样属违法行为"
  },
  {
    "id": "06-36",
    "category": "06",
    "zh": "舱单",
    "en": "Manifest",
    "abbr": "—",
    "meaning": "列明船上所载全部货物的清单",
    "usage": "Manifest filed with customs",
    "note": "与报关数据须一致"
  },
  {
    "id": "06-37",
    "category": "06",
    "zh": "码头收据",
    "en": "Dock Receipt",
    "abbr": "D/R",
    "meaning": "货物送交码头时签发的收据",
    "usage": "Dock receipt exchanged for B/L",
    "note": ""
  },
  {
    "id": "06-38",
    "category": "06",
    "zh": "提货单",
    "en": "Delivery Order",
    "abbr": "D/O",
    "meaning": "凭以到仓库或堆场提货的单据",
    "usage": "Delivery order issued against B/L",
    "note": ""
  },
  {
    "id": "06-39",
    "category": "06",
    "zh": "船公司",
    "en": "Shipping Company",
    "abbr": "—",
    "meaning": "拥有或经营船舶的运输企业",
    "usage": "Booked with a major shipping company",
    "note": ""
  },
  {
    "id": "06-40",
    "category": "06",
    "zh": "船代",
    "en": "Shipping Agent",
    "abbr": "—",
    "meaning": "代理船公司办理港口业务的企业",
    "usage": "The shipping agent will handle port formalities",
    "note": ""
  },
  {
    "id": "06-41",
    "category": "06",
    "zh": "无船承运人",
    "en": "Non-Vessel Operating Common Carrier",
    "abbr": "NVOCC",
    "meaning": "不拥有船舶但签发自己提单的运输经营者",
    "usage": "NVOCC B/L",
    "note": "货代取得资质后可签发"
  },
  {
    "id": "06-42",
    "category": "06",
    "zh": "船名航次",
    "en": "Vessel and Voyage",
    "abbr": "—",
    "meaning": "承运船舶的名称与航次编号",
    "usage": "Vessel: MSC ARIES, Voy. 026E",
    "note": "提单、信用证须一致"
  },
  {
    "id": "06-43",
    "category": "06",
    "zh": "预计开船时间",
    "en": "Estimated Time of Departure",
    "abbr": "ETD",
    "meaning": "船舶预计离港时间",
    "usage": "ETD: 15 June 2026",
    "note": ""
  },
  {
    "id": "06-44",
    "category": "06",
    "zh": "预计到港时间",
    "en": "Estimated Time of Arrival",
    "abbr": "ETA",
    "meaning": "船舶预计抵港时间",
    "usage": "ETA: 20 July 2026",
    "note": ""
  },
  {
    "id": "06-45",
    "category": "06",
    "zh": "滞期费",
    "en": "Demurrage",
    "abbr": "—",
    "meaning": "货物在港口超期堆存向船方支付的费用",
    "usage": "Demurrage of USD 80 per day",
    "note": "与滞箱费区分"
  },
  {
    "id": "06-46",
    "category": "06",
    "zh": "滞箱费",
    "en": "Detention",
    "abbr": "—",
    "meaning": "集装箱超期使用向船公司支付的费用",
    "usage": "Detention charges after 7 free days",
    "note": "免费使用期要记牢"
  },
  {
    "id": "06-47",
    "category": "06",
    "zh": "堆存费",
    "en": "Storage",
    "abbr": "—",
    "meaning": "货物在仓库或堆场存放的费用",
    "usage": "Storage charges at destination",
    "note": ""
  },
  {
    "id": "06-48",
    "category": "06",
    "zh": "港口拥挤附加费",
    "en": "Congestion Surcharge",
    "abbr": "—",
    "meaning": "因港口拥堵加收的附加费",
    "usage": "Congestion surcharge at Los Angeles",
    "note": ""
  },
  {
    "id": "06-49",
    "category": "06",
    "zh": "运费预付",
    "en": "Freight Prepaid",
    "abbr": "—",
    "meaning": "运费由发货人在起运地支付",
    "usage": "Freight prepaid",
    "note": "CIF/CFR 下通常预付"
  },
  {
    "id": "06-50",
    "category": "06",
    "zh": "运费到付",
    "en": "Freight Collect",
    "abbr": "—",
    "meaning": "运费由收货人在目的地支付",
    "usage": "Freight collect",
    "note": "FOB 下通常到付"
  },
  {
    "id": "06-51",
    "category": "06",
    "zh": "门到门",
    "en": "Door to Door",
    "abbr": "—",
    "meaning": "从发货人仓库直接送到收货人仓库",
    "usage": "Door-to-door delivery in 25 days",
    "note": "跨境电商常用"
  },
  {
    "id": "06-52",
    "category": "06",
    "zh": "送货上门",
    "en": "Door Delivery",
    "abbr": "—",
    "meaning": "将货物送至收货人指定地址",
    "usage": "Free door delivery within the city",
    "note": ""
  },
  {
    "id": "06-53",
    "category": "06",
    "zh": "运费吨",
    "en": "Freight Ton",
    "abbr": "—",
    "meaning": "计收运费的重量或体积单位",
    "usage": "Charged by freight ton (W/M)",
    "note": "取重量吨与体积吨较大者"
  },
  {
    "id": "06-54",
    "category": "06",
    "zh": "计费重量",
    "en": "Chargeable Weight",
    "abbr": "—",
    "meaning": "据以计算运费的重量",
    "usage": "Chargeable weight: 320 kg",
    "note": "空运按体积重与实重取大"
  },
  {
    "id": "07-1",
    "category": "07",
    "zh": "报关",
    "en": "Customs Declaration",
    "abbr": "—",
    "meaning": "向海关申报进出口货物的行为",
    "usage": "Customs declaration filed electronically",
    "note": "必须在截关前完成"
  },
  {
    "id": "07-2",
    "category": "07",
    "zh": "报关单",
    "en": "Customs Declaration Form",
    "abbr": "—",
    "meaning": "报关时提交的法定申报单据",
    "usage": "Customs declaration form with 10 items",
    "note": "申报要素填错会被查验"
  },
  {
    "id": "07-3",
    "category": "07",
    "zh": "报关行",
    "en": "Customs Broker",
    "abbr": "—",
    "meaning": "代理企业办理报关手续的专业机构",
    "usage": "We use a licensed customs broker",
    "note": ""
  },
  {
    "id": "07-4",
    "category": "07",
    "zh": "清关",
    "en": "Customs Clearance",
    "abbr": "—",
    "meaning": "办结海关手续、货物获准进出境",
    "usage": "Customs clearance takes 2 working days",
    "note": "与报关是过程与结果的关系"
  },
  {
    "id": "07-5",
    "category": "07",
    "zh": "放行",
    "en": "Release",
    "abbr": "—",
    "meaning": "海关准许货物提取或装运",
    "usage": "Goods released by customs",
    "note": "放行后仍需注意查验"
  },
  {
    "id": "07-6",
    "category": "07",
    "zh": "查验",
    "en": "Customs Inspection",
    "abbr": "—",
    "meaning": "海关对货物进行实际核对",
    "usage": "Random customs inspection",
    "note": "查验会产生额外费用与延误"
  },
  {
    "id": "07-7",
    "category": "07",
    "zh": "关税",
    "en": "Customs Duty",
    "abbr": "—",
    "meaning": "海关对进出口货物征收的税",
    "usage": "Import duty at 6.5%",
    "note": "DDP 报价必须算进去"
  },
  {
    "id": "07-8",
    "category": "07",
    "zh": "进口增值税",
    "en": "Import VAT",
    "abbr": "—",
    "meaning": "进口环节征收的增值税",
    "usage": "Import VAT of 13% is recoverable",
    "note": "多数国家可抵扣"
  },
  {
    "id": "07-9",
    "category": "07",
    "zh": "消费税",
    "en": "Consumption Tax",
    "abbr": "—",
    "meaning": "对特定消费品征收的税",
    "usage": "Consumption tax on luxury goods",
    "note": ""
  },
  {
    "id": "07-10",
    "category": "07",
    "zh": "反倾销税",
    "en": "Anti-dumping Duty",
    "abbr": "—",
    "meaning": "对低价倾销商品额外征收的税",
    "usage": "Anti-dumping duty of 25% on Chinese steel",
    "note": "一旦立案，税率可能追溯"
  },
  {
    "id": "07-11",
    "category": "07",
    "zh": "反补贴税",
    "en": "Countervailing Duty",
    "abbr": "CVD",
    "meaning": "对接受政府补贴的商品征收的税",
    "usage": "Countervailing duty investigation initiated",
    "note": ""
  },
  {
    "id": "07-12",
    "category": "07",
    "zh": "最惠国税率",
    "en": "Most-Favoured-Nation Rate",
    "abbr": "MFN",
    "meaning": "对 WTO 成员适用的正常税率",
    "usage": "MFN rate is 3.7%",
    "note": "自贸协定下可更低"
  },
  {
    "id": "07-13",
    "category": "07",
    "zh": "关税配额",
    "en": "Tariff Quota",
    "abbr": "—",
    "meaning": "限额内低税率、限额外高税率",
    "usage": "Tariff quota for rice imports",
    "note": ""
  },
  {
    "id": "07-14",
    "category": "07",
    "zh": "完税价格",
    "en": "Dutiable Value",
    "abbr": "—",
    "meaning": "据以计征关税的价格基础",
    "usage": "Dutiable value based on CIF price",
    "note": "各国估价规则不同"
  },
  {
    "id": "07-15",
    "category": "07",
    "zh": "海关估价",
    "en": "Customs Valuation",
    "abbr": "—",
    "meaning": "海关依法确定货物完税价格的过程",
    "usage": "Customs valuation challenged by the importer",
    "note": "低报价格风险极高"
  },
  {
    "id": "07-16",
    "category": "07",
    "zh": "HS 编码",
    "en": "Harmonized System Code",
    "abbr": "HS Code",
    "meaning": "国际通用的商品分类编码",
    "usage": "HS code: 8517.62.00",
    "note": "归类错误会导致税率与监管条件错"
  },
  {
    "id": "07-17",
    "category": "07",
    "zh": "申报要素",
    "en": "Declaration Elements",
    "abbr": "—",
    "meaning": "报关时须申报的商品属性信息",
    "usage": "Declaration elements: material, function, brand",
    "note": "不同 HS 编码要求不同"
  },
  {
    "id": "07-18",
    "category": "07",
    "zh": "单证一致",
    "en": "Documents Compliance",
    "abbr": "—",
    "meaning": "报关单、发票、装箱单、提单等数据互相吻合",
    "usage": "All documents must be consistent",
    "note": "不一致是查验与退单主因"
  },
  {
    "id": "07-19",
    "category": "07",
    "zh": "保税区",
    "en": "Bonded Zone",
    "abbr": "—",
    "meaning": "货物在区内暂免关税的特殊监管区域",
    "usage": "Goods stored in a bonded zone",
    "note": ""
  },
  {
    "id": "07-20",
    "category": "07",
    "zh": "保税仓库",
    "en": "Bonded Warehouse",
    "abbr": "—",
    "meaning": "经海关批准可暂缓纳税的仓库",
    "usage": "Bonded warehouse storage for 6 months",
    "note": ""
  },
  {
    "id": "07-21",
    "category": "07",
    "zh": "加工贸易",
    "en": "Processing Trade",
    "abbr": "—",
    "meaning": "进口料件加工后复出口的贸易方式",
    "usage": "Processing trade under the manual system",
    "note": "需办理加工贸易手册"
  },
  {
    "id": "07-22",
    "category": "07",
    "zh": "来料加工",
    "en": "Processing with Supplied Materials",
    "abbr": "—",
    "meaning": "外商提供料件、我方加工收取工缴费",
    "usage": "Processing with supplied materials",
    "note": "料件与成品均属外商"
  },
  {
    "id": "07-23",
    "category": "07",
    "zh": "进料加工",
    "en": "Processing with Imported Materials",
    "abbr": "—",
    "meaning": "我方自行进口料件、加工后出口",
    "usage": "Processing with imported materials",
    "note": "我方自负盈亏"
  },
  {
    "id": "07-24",
    "category": "07",
    "zh": "一般贸易",
    "en": "General Trade",
    "abbr": "—",
    "meaning": "正常进出口、单独计征关税的贸易方式",
    "usage": "General trade under code 0110",
    "note": ""
  },
  {
    "id": "07-25",
    "category": "07",
    "zh": "跨境电商",
    "en": "Cross-border E-commerce",
    "abbr": "—",
    "meaning": "通过电商平台完成的跨境交易",
    "usage": "Cross-border e-commerce retail export",
    "note": ""
  },
  {
    "id": "07-26",
    "category": "07",
    "zh": "市场采购贸易",
    "en": "Market Procurement Trade",
    "abbr": "—",
    "meaning": "在特定市场采购商品出口的贸易方式",
    "usage": "Market procurement trade under code 1039",
    "note": "适合小商品多批次出口"
  },
  {
    "id": "07-27",
    "category": "07",
    "zh": "监管方式代码",
    "en": "Customs Supervision Code",
    "abbr": "—",
    "meaning": "标识贸易方式的海关四位代码",
    "usage": "Supervision code 0110 for general trade",
    "note": ""
  },
  {
    "id": "07-28",
    "category": "07",
    "zh": "一般贸易代码",
    "en": "General Trade Code",
    "abbr": "0110",
    "meaning": "一般贸易的海关监管方式代码",
    "usage": "Declared under 0110",
    "note": ""
  },
  {
    "id": "07-29",
    "category": "07",
    "zh": "跨境电商零售出口",
    "en": "Cross-border E-commerce Retail Export",
    "abbr": "9610",
    "meaning": "跨境电商 B2C 零售出口的监管代码",
    "usage": "9610 mode for small parcels",
    "note": ""
  },
  {
    "id": "07-30",
    "category": "07",
    "zh": "跨境电商 B2B 出口",
    "en": "Cross-border B2B Direct Export",
    "abbr": "9710",
    "meaning": "跨境电商企业对企业出口的监管代码",
    "usage": "9710 declaration",
    "note": ""
  },
  {
    "id": "07-31",
    "category": "07",
    "zh": "跨境电商海外仓",
    "en": "Cross-border E-commerce Overseas Warehouse",
    "abbr": "9810",
    "meaning": "货物先出口至海外仓再销售的监管代码",
    "usage": "9810 mode",
    "note": ""
  },
  {
    "id": "07-32",
    "category": "07",
    "zh": "出口退税",
    "en": "Export Tax Rebate",
    "abbr": "—",
    "meaning": "退还出口货物国内环节已征增值税、消费税",
    "usage": "Apply for export tax rebate within the deadline",
    "note": "单证不齐无法退税"
  },
  {
    "id": "07-33",
    "category": "07",
    "zh": "退税率",
    "en": "Rebate Rate",
    "abbr": "—",
    "meaning": "出口货物适用的退税比例",
    "usage": "Rebate rate: 13%",
    "note": "以出口货物 HS 编码为准"
  },
  {
    "id": "07-34",
    "category": "07",
    "zh": "免抵退税",
    "en": "Exemption, Credit and Refund",
    "abbr": "—",
    "meaning": "生产企业出口货物增值税的计算办法",
    "usage": "Exemption, credit and refund method",
    "note": "外贸企业适用免退税"
  },
  {
    "id": "07-35",
    "category": "07",
    "zh": "退税申报",
    "en": "Tax Rebate Filing",
    "abbr": "—",
    "meaning": "向税务机关申报办理出口退税",
    "usage": "Rebate filing submitted online",
    "note": "有申报期限，逾期视同内销"
  },
  {
    "id": "07-36",
    "category": "07",
    "zh": "增值税专用发票",
    "en": "VAT Special Invoice",
    "abbr": "—",
    "meaning": "可用于抵扣进项税的发票",
    "usage": "VAT special invoice from the supplier",
    "note": "退税的核心凭证"
  },
  {
    "id": "07-37",
    "category": "07",
    "zh": "单证备案",
    "en": "Documentation Filing",
    "abbr": "—",
    "meaning": "按规定留存出口单证备查",
    "usage": "Keep the documents on file for 5 years",
    "note": ""
  },
  {
    "id": "07-38",
    "category": "07",
    "zh": "原产地证",
    "en": "Certificate of Origin",
    "abbr": "C/O",
    "meaning": "证明货物原产国的官方文件",
    "usage": "Certificate of Origin issued by CCPIT",
    "note": "进口国据此给予关税优惠"
  },
  {
    "id": "07-39",
    "category": "07",
    "zh": "普惠制产地证",
    "en": "Form A",
    "abbr": "FORM A",
    "meaning": "发达国家给予发展中国家普惠制优惠的产地证",
    "usage": "Form A for GSP benefits",
    "note": "欧盟等已逐步取消"
  },
  {
    "id": "07-40",
    "category": "07",
    "zh": "中国-东盟原产地证",
    "en": "Form E",
    "abbr": "FORM E",
    "meaning": "中国与东盟自贸区项下的优惠产地证",
    "usage": "Form E to enjoy zero tariff",
    "note": ""
  },
  {
    "id": "07-41",
    "category": "07",
    "zh": "RCEP 原产地证",
    "en": "RCEP Certificate of Origin",
    "abbr": "—",
    "meaning": "区域全面经济伙伴关系协定项下的优惠产地证",
    "usage": "RCEP C/O for Japanese market",
    "note": "可累积原产地成分"
  },
  {
    "id": "07-42",
    "category": "07",
    "zh": "原产地规则",
    "en": "Rules of Origin",
    "abbr": "—",
    "meaning": "判定货物原产国的标准",
    "usage": "Rules of origin under the FTA",
    "note": ""
  },
  {
    "id": "07-43",
    "category": "07",
    "zh": "实质性改变",
    "en": "Substantial Transformation",
    "abbr": "—",
    "meaning": "产品经加工后在性质上发生根本变化",
    "usage": "Substantial transformation test",
    "note": "判定原产地的核心标准"
  },
  {
    "id": "07-44",
    "category": "07",
    "zh": "区域价值成分",
    "en": "Regional Value Content",
    "abbr": "RVC",
    "meaning": "区域内增加值占产品价值的比例",
    "usage": "RVC of at least 40%",
    "note": ""
  },
  {
    "id": "07-45",
    "category": "07",
    "zh": "商品检验",
    "en": "Commodity Inspection",
    "abbr": "—",
    "meaning": "对商品品质、数量、包装的检验",
    "usage": "Commodity inspection by CIQ",
    "note": ""
  },
  {
    "id": "07-46",
    "category": "07",
    "zh": "检验检疫",
    "en": "Inspection and Quarantine",
    "abbr": "—",
    "meaning": "对进出口商品与动植物的检验与防疫",
    "usage": "Inspection and quarantine certificate",
    "note": ""
  },
  {
    "id": "07-47",
    "category": "07",
    "zh": "报检",
    "en": "Inspection Declaration",
    "abbr": "—",
    "meaning": "向检验检疫机构申报检验",
    "usage": "Inspection declaration filed with customs",
    "note": "现已与报关合并申报"
  },
  {
    "id": "07-48",
    "category": "07",
    "zh": "通关单",
    "en": "Customs Clearance Form",
    "abbr": "—",
    "meaning": "检验检疫合格后出具的通关凭证",
    "usage": "Customs clearance form required for the declaration",
    "note": ""
  },
  {
    "id": "07-49",
    "category": "07",
    "zh": "3C 认证",
    "en": "China Compulsory Certification",
    "abbr": "CCC",
    "meaning": "中国强制性产品认证",
    "usage": "CCC certificate required for this product",
    "note": "目录内产品无证不得进口"
  },
  {
    "id": "07-50",
    "category": "07",
    "zh": "AEO 认证",
    "en": "Authorized Economic Operator",
    "abbr": "AEO",
    "meaning": "海关认证的高级信用企业资质",
    "usage": "AEO advanced certification",
    "note": "通关便利、查验率低"
  },
  {
    "id": "08-1",
    "category": "08",
    "zh": "保险",
    "en": "Insurance",
    "abbr": "—",
    "meaning": "以支付保费为代价转移风险的安排",
    "usage": "Cargo insurance is arranged by the seller under CIF",
    "note": ""
  },
  {
    "id": "08-2",
    "category": "08",
    "zh": "投保",
    "en": "To Effect Insurance",
    "abbr": "—",
    "meaning": "向保险人办理保险手续",
    "usage": "Please insure the goods against All Risks",
    "note": ""
  },
  {
    "id": "08-3",
    "category": "08",
    "zh": "保险人",
    "en": "Insurer",
    "abbr": "—",
    "meaning": "承保风险、承担赔付责任的一方",
    "usage": "The insurer is PICC",
    "note": ""
  },
  {
    "id": "08-4",
    "category": "08",
    "zh": "被保险人",
    "en": "Insured",
    "abbr": "—",
    "meaning": "保险合同的受益方",
    "usage": "The insured is the buyer",
    "note": ""
  },
  {
    "id": "08-5",
    "category": "08",
    "zh": "保险单",
    "en": "Insurance Policy",
    "abbr": "—",
    "meaning": "保险合同的正式书面凭证",
    "usage": "Insurance policy in duplicate",
    "note": ""
  },
  {
    "id": "08-6",
    "category": "08",
    "zh": "保险凭证",
    "en": "Certificate of Insurance",
    "abbr": "—",
    "meaning": "简化的保险证明文件",
    "usage": "Certificate of insurance acceptable",
    "note": "部分信用证允许"
  },
  {
    "id": "08-7",
    "category": "08",
    "zh": "保险金额",
    "en": "Insured Amount",
    "abbr": "—",
    "meaning": "保险人承担赔付的最高限额",
    "usage": "Insured amount: 110% of invoice value",
    "note": "惯例为发票金额加成 10%"
  },
  {
    "id": "08-8",
    "category": "08",
    "zh": "保险费",
    "en": "Insurance Premium",
    "abbr": "—",
    "meaning": "投保人支付给保险人的费用",
    "usage": "Premium: USD 180",
    "note": ""
  },
  {
    "id": "08-9",
    "category": "08",
    "zh": "保险费率",
    "en": "Premium Rate",
    "abbr": "—",
    "meaning": "计算保费的比率",
    "usage": "Rate: 0.12% of insured amount",
    "note": ""
  },
  {
    "id": "08-10",
    "category": "08",
    "zh": "险别",
    "en": "Coverage",
    "abbr": "—",
    "meaning": "保险合同承保的风险范围",
    "usage": "Coverage: ICC(A)",
    "note": ""
  },
  {
    "id": "08-11",
    "category": "08",
    "zh": "平安险",
    "en": "Free from Particular Average",
    "abbr": "FPA",
    "meaning": "中国保险条款中责任范围最小的基本险",
    "usage": "FPA covers total loss only in most cases",
    "note": "仅承保全部损失为主"
  },
  {
    "id": "08-12",
    "category": "08",
    "zh": "水渍险",
    "en": "With Particular Average",
    "abbr": "WPA / WA",
    "meaning": "在平安险基础上加保部分损失",
    "usage": "WPA covers partial loss from sea water",
    "note": ""
  },
  {
    "id": "08-13",
    "category": "08",
    "zh": "一切险",
    "en": "All Risks",
    "abbr": "—",
    "meaning": "承保一切外来风险所致损失的险别",
    "usage": "All Risks coverage",
    "note": "不含战争、罢工等特殊风险"
  },
  {
    "id": "08-14",
    "category": "08",
    "zh": "附加险",
    "en": "Additional Risks",
    "abbr": "—",
    "meaning": "在基本险之外加保的风险",
    "usage": "Additional risks: TPND, breakage",
    "note": "不能单独投保"
  },
  {
    "id": "08-15",
    "category": "08",
    "zh": "战争险",
    "en": "War Risk",
    "abbr": "—",
    "meaning": "承保战争行为造成的损失",
    "usage": "War risk included",
    "note": "保费低但需单独加保"
  },
  {
    "id": "08-16",
    "category": "08",
    "zh": "罢工险",
    "en": "Strike Risk",
    "abbr": "—",
    "meaning": "承保罢工、民变造成的损失",
    "usage": "Strike risk covered",
    "note": ""
  },
  {
    "id": "08-17",
    "category": "08",
    "zh": "偷窃提货不着险",
    "en": "Theft, Pilferage and Non-Delivery",
    "abbr": "TPND",
    "meaning": "承保偷窃及到港提不到货的损失",
    "usage": "TPND cover",
    "note": ""
  },
  {
    "id": "08-18",
    "category": "08",
    "zh": "碰损破碎险",
    "en": "Clash and Breakage",
    "abbr": "—",
    "meaning": "承保碰撞、破碎造成的损失",
    "usage": "Clash and breakage cover for glassware",
    "note": ""
  },
  {
    "id": "08-19",
    "category": "08",
    "zh": "淡水雨淋险",
    "en": "Fresh Water and Rain Damage",
    "abbr": "—",
    "meaning": "承保淡水或雨水浸损",
    "usage": "Fresh water and rain damage cover",
    "note": ""
  },
  {
    "id": "08-20",
    "category": "08",
    "zh": "短量险",
    "en": "Risk of Shortage",
    "abbr": "—",
    "meaning": "承保数量短少的损失",
    "usage": "Risk of shortage for bulk cargo",
    "note": ""
  },
  {
    "id": "08-21",
    "category": "08",
    "zh": "仓至仓条款",
    "en": "Warehouse to Warehouse Clause",
    "abbr": "W/W",
    "meaning": "保险责任自发货人仓库至收货人仓库的约定",
    "usage": "Coverage is on a warehouse-to-warehouse basis",
    "note": "注意终止期限"
  },
  {
    "id": "08-22",
    "category": "08",
    "zh": "免赔额",
    "en": "Deductible / Franchise",
    "abbr": "—",
    "meaning": "保险人免于赔付的金额或比例",
    "usage": "Franchise of 0.5%",
    "note": "免赔额与免赔率含义不同"
  },
  {
    "id": "08-23",
    "category": "08",
    "zh": "索赔",
    "en": "Claim",
    "abbr": "—",
    "meaning": "受损方向责任方提出赔偿要求",
    "usage": "We file a claim for the damaged goods",
    "note": "注意索赔期限"
  },
  {
    "id": "08-24",
    "category": "08",
    "zh": "理赔",
    "en": "Claim Settlement",
    "abbr": "—",
    "meaning": "保险人或责任方处理索赔的过程",
    "usage": "Claim settled at USD 3,200",
    "note": ""
  },
  {
    "id": "08-25",
    "category": "08",
    "zh": "检验报告",
    "en": "Survey Report",
    "abbr": "—",
    "meaning": "公证机构出具的货物状况鉴定报告",
    "usage": "Survey report issued at the destination port",
    "note": "索赔的关键证据"
  },
  {
    "id": "08-26",
    "category": "08",
    "zh": "公估行",
    "en": "Surveyor",
    "abbr": "—",
    "meaning": "独立从事货物检验估损的机构",
    "usage": "Appointed an independent surveyor",
    "note": ""
  },
  {
    "id": "08-27",
    "category": "08",
    "zh": "代位求偿",
    "en": "Subrogation",
    "abbr": "—",
    "meaning": "保险人赔付后取得向责任方追偿的权利",
    "usage": "Insurer exercises subrogation rights",
    "note": ""
  },
  {
    "id": "08-28",
    "category": "08",
    "zh": "施救费用",
    "en": "Sue and Labor Charges",
    "abbr": "—",
    "meaning": "为避免或减少损失而支出的合理费用",
    "usage": "Sue and labor charges are recoverable",
    "note": ""
  },
  {
    "id": "08-29",
    "category": "08",
    "zh": "全部损失",
    "en": "Total Loss",
    "abbr": "—",
    "meaning": "保险标的全部灭失",
    "usage": "Constructive total loss declared",
    "note": ""
  },
  {
    "id": "08-30",
    "category": "08",
    "zh": "实际全损",
    "en": "Actual Total Loss",
    "abbr": "—",
    "meaning": "货物实际完全损毁或失去使用价值",
    "usage": "Actual total loss of the cargo",
    "note": ""
  },
  {
    "id": "08-31",
    "category": "08",
    "zh": "推定全损",
    "en": "Constructive Total Loss",
    "abbr": "—",
    "meaning": "虽未全损但修复费用超过货值",
    "usage": "Constructive total loss claim",
    "note": ""
  },
  {
    "id": "08-32",
    "category": "08",
    "zh": "部分损失",
    "en": "Partial Loss",
    "abbr": "—",
    "meaning": "货物部分受损",
    "usage": "Partial loss covered under WPA",
    "note": ""
  },
  {
    "id": "08-33",
    "category": "08",
    "zh": "共同海损",
    "en": "General Average",
    "abbr": "—",
    "meaning": "为共同安全有意采取的合理措施所造成的牺牲与费用",
    "usage": "General average contribution required",
    "note": "各受益方按比例分摊"
  },
  {
    "id": "08-34",
    "category": "08",
    "zh": "单独海损",
    "en": "Particular Average",
    "abbr": "—",
    "meaning": "仅涉及单方利益的损失",
    "usage": "Particular average is not shared",
    "note": ""
  },
  {
    "id": "08-35",
    "category": "08",
    "zh": "赔付",
    "en": "Indemnity",
    "abbr": "—",
    "meaning": "保险人按约支付的赔偿金",
    "usage": "Indemnity paid within 30 days",
    "note": ""
  },
  {
    "id": "09-1",
    "category": "09",
    "zh": "质量",
    "en": "Quality",
    "abbr": "—",
    "meaning": "产品满足规定要求的程度",
    "usage": "Quality is our first priority",
    "note": ""
  },
  {
    "id": "09-2",
    "category": "09",
    "zh": "质量标准",
    "en": "Quality Standard",
    "abbr": "—",
    "meaning": "衡量质量的统一技术规范",
    "usage": "Complies with EN 71 standard",
    "note": "写明标准号才可执行"
  },
  {
    "id": "09-3",
    "category": "09",
    "zh": "质量控制",
    "en": "Quality Control",
    "abbr": "QC",
    "meaning": "生产过程中对质量的检验与把关",
    "usage": "QC inspection at every stage",
    "note": ""
  },
  {
    "id": "09-4",
    "category": "09",
    "zh": "质量保证",
    "en": "Quality Assurance",
    "abbr": "QA",
    "meaning": "通过体系保证产品质量稳定",
    "usage": "QA system certified to ISO 9001",
    "note": ""
  },
  {
    "id": "09-5",
    "category": "09",
    "zh": "质量管理体系",
    "en": "Quality Management System",
    "abbr": "QMS",
    "meaning": "组织内部的质量管理制度体系",
    "usage": "QMS audited annually",
    "note": ""
  },
  {
    "id": "09-6",
    "category": "09",
    "zh": "抽样",
    "en": "Sampling",
    "abbr": "—",
    "meaning": "从整批货物中抽取部分进行检验",
    "usage": "Sampling per ISO 2859-1",
    "note": ""
  },
  {
    "id": "09-7",
    "category": "09",
    "zh": "抽样方案",
    "en": "Sampling Plan",
    "abbr": "—",
    "meaning": "规定抽样数量与判定规则的方案",
    "usage": "Sampling plan: AQL 2.5, level II",
    "note": ""
  },
  {
    "id": "09-8",
    "category": "09",
    "zh": "接收质量限",
    "en": "Acceptance Quality Limit",
    "abbr": "AQL",
    "meaning": "可接受的最差过程平均质量水平",
    "usage": "AQL 2.5 for major defects",
    "note": "AQL 不是合格率"
  },
  {
    "id": "09-9",
    "category": "09",
    "zh": "全检",
    "en": "100% Inspection",
    "abbr": "—",
    "meaning": "对全部产品逐件检验",
    "usage": "100% inspection before packing",
    "note": "成本高、耗时长"
  },
  {
    "id": "09-10",
    "category": "09",
    "zh": "抽检",
    "en": "Spot Check",
    "abbr": "—",
    "meaning": "随机抽取少量样品检验",
    "usage": "Spot check during production",
    "note": ""
  },
  {
    "id": "09-11",
    "category": "09",
    "zh": "首件确认",
    "en": "First Article Inspection",
    "abbr": "FAI",
    "meaning": "批量生产前对首件产品的确认",
    "usage": "FAI report approved by the buyer",
    "note": ""
  },
  {
    "id": "09-12",
    "category": "09",
    "zh": "验货",
    "en": "Inspection",
    "abbr": "—",
    "meaning": "对货物进行质量与数量核对",
    "usage": "Third-party inspection before shipment",
    "note": ""
  },
  {
    "id": "09-13",
    "category": "09",
    "zh": "验货报告",
    "en": "Inspection Report",
    "abbr": "—",
    "meaning": "记录验货结果的书面文件",
    "usage": "Inspection report with photos",
    "note": ""
  },
  {
    "id": "09-14",
    "category": "09",
    "zh": "第三方验货",
    "en": "Third-Party Inspection",
    "abbr": "—",
    "meaning": "由独立机构执行的验货",
    "usage": "SGS third-party inspection",
    "note": "费用通常由买方承担"
  },
  {
    "id": "09-15",
    "category": "09",
    "zh": "出货前检验",
    "en": "Pre-shipment Inspection",
    "abbr": "PSI",
    "meaning": "装运前对整批货物进行的检验",
    "usage": "PSI passed on 8 June",
    "note": ""
  },
  {
    "id": "09-16",
    "category": "09",
    "zh": "工厂审核",
    "en": "Factory Audit",
    "abbr": "—",
    "meaning": "对供应商工厂的现场审查",
    "usage": "Factory audit passed with 85 points",
    "note": "客户下单前常要求"
  },
  {
    "id": "09-17",
    "category": "09",
    "zh": "社会责任审核",
    "en": "Social Compliance Audit",
    "abbr": "—",
    "meaning": "对劳工、环境、安全等社会责任的审查",
    "usage": "BSCI social compliance audit",
    "note": "欧美买家普遍要求"
  },
  {
    "id": "09-18",
    "category": "09",
    "zh": "公差",
    "en": "Tolerance",
    "abbr": "—",
    "meaning": "允许的尺寸或参数偏差范围",
    "usage": "Tolerance: ±0.5 mm",
    "note": "须在规格书中写明"
  },
  {
    "id": "09-19",
    "category": "09",
    "zh": "不良率",
    "en": "Defect Rate",
    "abbr": "—",
    "meaning": "不合格品占全部产品的比例",
    "usage": "Defect rate below 0.3%",
    "note": ""
  },
  {
    "id": "09-20",
    "category": "09",
    "zh": "缺陷",
    "en": "Defect",
    "abbr": "—",
    "meaning": "产品不符合要求的具体问题",
    "usage": "Major defect: broken zipper",
    "note": "通常分致命/严重/轻微"
  },
  {
    "id": "09-21",
    "category": "09",
    "zh": "返工",
    "en": "Rework",
    "abbr": "—",
    "meaning": "对不合格品进行修复",
    "usage": "Rework cost borne by the factory",
    "note": ""
  },
  {
    "id": "09-22",
    "category": "09",
    "zh": "报废",
    "en": "Scrap",
    "abbr": "—",
    "meaning": "无法修复而废弃的产品",
    "usage": "Scrap rate of 1.2%",
    "note": ""
  },
  {
    "id": "09-23",
    "category": "09",
    "zh": "让步接收",
    "en": "Concession",
    "abbr": "—",
    "meaning": "对轻微不合格品的降价接收",
    "usage": "Buyer granted a concession on 200 pcs",
    "note": "须书面确认，避免后续索赔"
  },
  {
    "id": "09-24",
    "category": "09",
    "zh": "纠正预防措施",
    "en": "Corrective and Preventive Action",
    "abbr": "CAPA",
    "meaning": "针对问题原因采取的纠正与预防措施",
    "usage": "CAPA report required within 7 days",
    "note": ""
  },
  {
    "id": "09-25",
    "category": "09",
    "zh": "保修",
    "en": "Warranty",
    "abbr": "—",
    "meaning": "卖方对产品在一定期限内的质量承诺",
    "usage": "12-month warranty from delivery",
    "note": ""
  },
  {
    "id": "09-26",
    "category": "09",
    "zh": "质保期",
    "en": "Warranty Period",
    "abbr": "—",
    "meaning": "承担保修责任的期间",
    "usage": "Warranty period: 12 months",
    "note": "起算点要写明"
  },
  {
    "id": "09-27",
    "category": "09",
    "zh": "售后服务",
    "en": "After-sales Service",
    "abbr": "—",
    "meaning": "销售后提供的维修、配件等支持",
    "usage": "Local after-sales service available",
    "note": ""
  },
  {
    "id": "09-28",
    "category": "09",
    "zh": "召回",
    "en": "Recall",
    "abbr": "—",
    "meaning": "对存在安全隐患的产品收回",
    "usage": "Product recall initiated",
    "note": "成本极高，须买产品责任险"
  },
  {
    "id": "09-29",
    "category": "09",
    "zh": "认证",
    "en": "Certification",
    "abbr": "—",
    "meaning": "由机构证明产品符合特定标准",
    "usage": "CE certification required for the EU",
    "note": ""
  },
  {
    "id": "09-30",
    "category": "09",
    "zh": "CE 认证",
    "en": "CE Marking",
    "abbr": "CE",
    "meaning": "欧盟市场准入的强制性合格标志",
    "usage": "CE marking affixed to the product",
    "note": "需有技术文件与符合性声明"
  },
  {
    "id": "09-31",
    "category": "09",
    "zh": "FCC 认证",
    "en": "FCC Certification",
    "abbr": "FCC",
    "meaning": "美国电磁兼容性认证",
    "usage": "FCC Part 15 compliance",
    "note": ""
  },
  {
    "id": "09-32",
    "category": "09",
    "zh": "RoHS 指令",
    "en": "RoHS Directive",
    "abbr": "RoHS",
    "meaning": "欧盟限制有害物质使用的指令",
    "usage": "RoHS compliant materials",
    "note": ""
  },
  {
    "id": "09-33",
    "category": "09",
    "zh": "REACH 法规",
    "en": "REACH Regulation",
    "abbr": "REACH",
    "meaning": "欧盟化学品注册、评估与授权法规",
    "usage": "REACH SVHC declaration",
    "note": ""
  },
  {
    "id": "09-34",
    "category": "09",
    "zh": "UL 认证",
    "en": "UL Certification",
    "abbr": "UL",
    "meaning": "美国安全认证标志",
    "usage": "UL listed components",
    "note": ""
  },
  {
    "id": "09-35",
    "category": "09",
    "zh": "FDA 注册",
    "en": "FDA Registration",
    "abbr": "FDA",
    "meaning": "美国食品药品监督管理局的注册要求",
    "usage": "FDA registration for food contact items",
    "note": ""
  },
  {
    "id": "09-36",
    "category": "09",
    "zh": "ISO 9001",
    "en": "ISO 9001",
    "abbr": "ISO 9001",
    "meaning": "国际通用的质量管理体系标准",
    "usage": "ISO 9001 certified factory",
    "note": ""
  },
  {
    "id": "09-37",
    "category": "09",
    "zh": "检测报告",
    "en": "Test Report",
    "abbr": "—",
    "meaning": "检测机构出具的产品测试结果",
    "usage": "Test report from Intertek",
    "note": "注意报告有效期与型号对应"
  },
  {
    "id": "09-38",
    "category": "09",
    "zh": "化学品安全说明书",
    "en": "Safety Data Sheet",
    "abbr": "SDS",
    "meaning": "化学品成分与安全信息的文件",
    "usage": "SDS in English required for shipping",
    "note": "空运海运均可能要求"
  },
  {
    "id": "09-39",
    "category": "09",
    "zh": "产品责任",
    "en": "Product Liability",
    "abbr": "—",
    "meaning": "因产品缺陷致人损害的法律责任",
    "usage": "Product liability insurance",
    "note": "欧美索赔金额可能极高"
  },
  {
    "id": "10-1",
    "category": "10",
    "zh": "询盘",
    "en": "Inquiry",
    "abbr": "—",
    "meaning": "客户对产品价格等条件的询问",
    "usage": "We received an inquiry from a German buyer",
    "note": "回复速度直接影响成交率"
  },
  {
    "id": "10-2",
    "category": "10",
    "zh": "客户",
    "en": "Customer",
    "abbr": "—",
    "meaning": "购买产品或服务的对象",
    "usage": "Our key customer in Europe",
    "note": ""
  },
  {
    "id": "10-3",
    "category": "10",
    "zh": "潜在客户",
    "en": "Prospect",
    "abbr": "—",
    "meaning": "有需求但尚未成交的客户",
    "usage": "We are following up with 20 prospects",
    "note": ""
  },
  {
    "id": "10-4",
    "category": "10",
    "zh": "新客户",
    "en": "New Customer",
    "abbr": "—",
    "meaning": "首次交易的客户",
    "usage": "New customers usually start with a trial order",
    "note": ""
  },
  {
    "id": "10-5",
    "category": "10",
    "zh": "老客户",
    "en": "Existing Customer",
    "abbr": "—",
    "meaning": "已有交易历史的客户",
    "usage": "Existing customers get priority in production",
    "note": ""
  },
  {
    "id": "10-6",
    "category": "10",
    "zh": "客户开发",
    "en": "Customer Development",
    "abbr": "—",
    "meaning": "寻找并转化新客户的过程",
    "usage": "Customer development through trade fairs",
    "note": ""
  },
  {
    "id": "10-7",
    "category": "10",
    "zh": "展会",
    "en": "Trade Fair",
    "abbr": "—",
    "meaning": "集中展示产品、接触买家的活动",
    "usage": "We will exhibit at the Canton Fair",
    "note": ""
  },
  {
    "id": "10-8",
    "category": "10",
    "zh": "广交会",
    "en": "Canton Fair",
    "abbr": "—",
    "meaning": "中国进出口商品交易会",
    "usage": "Booth No. 12.2B15 at the Canton Fair",
    "note": "每年春秋两届"
  },
  {
    "id": "10-9",
    "category": "10",
    "zh": "B2B 平台",
    "en": "B2B Platform",
    "abbr": "—",
    "meaning": "企业间交易的线上平台",
    "usage": "Alibaba.com is a major B2B platform",
    "note": ""
  },
  {
    "id": "10-10",
    "category": "10",
    "zh": "开发信",
    "en": "Cold Email",
    "abbr": "—",
    "meaning": "主动发送给潜在客户的邮件",
    "usage": "A well-written cold email gets 5% replies",
    "note": "切忌群发无针对性"
  },
  {
    "id": "10-11",
    "category": "10",
    "zh": "跟进",
    "en": "Follow-up",
    "abbr": "—",
    "meaning": "对已联系客户持续沟通",
    "usage": "Just following up on my email of last week",
    "note": "跟进节奏比频率更重要"
  },
  {
    "id": "10-12",
    "category": "10",
    "zh": "还价",
    "en": "Price Negotiation",
    "abbr": "—",
    "meaning": "买卖双方就价格进行磋商",
    "usage": "After several rounds of price negotiation",
    "note": ""
  },
  {
    "id": "10-13",
    "category": "10",
    "zh": "起订量",
    "en": "Minimum Order Quantity",
    "abbr": "MOQ",
    "meaning": "卖方要求的最低订购数量",
    "usage": "MOQ: 1,000 pcs per color",
    "note": "新客户常拿 MOQ 砍价"
  },
  {
    "id": "10-14",
    "category": "10",
    "zh": "交货期",
    "en": "Lead Time",
    "abbr": "—",
    "meaning": "从下单到交货的时间",
    "usage": "Lead time: 25-30 days",
    "note": ""
  },
  {
    "id": "10-15",
    "category": "10",
    "zh": "现货",
    "en": "In Stock",
    "abbr": "—",
    "meaning": "仓库中现有可立即发货的货物",
    "usage": "The item is in stock and ready to ship",
    "note": ""
  },
  {
    "id": "10-16",
    "category": "10",
    "zh": "缺货",
    "en": "Out of Stock",
    "abbr": "—",
    "meaning": "暂无库存",
    "usage": "Sorry, this color is out of stock",
    "note": "及时告知，避免客户流失"
  },
  {
    "id": "10-17",
    "category": "10",
    "zh": "打样",
    "en": "Sampling",
    "abbr": "—",
    "meaning": "按客户要求制作样品",
    "usage": "Sampling takes 7 working days",
    "note": ""
  },
  {
    "id": "10-18",
    "category": "10",
    "zh": "打样费",
    "en": "Sampling Fee",
    "abbr": "—",
    "meaning": "制作样品收取的费用",
    "usage": "Sampling fee is refundable against the order",
    "note": "写明可退条件"
  },
  {
    "id": "10-19",
    "category": "10",
    "zh": "免费样品",
    "en": "Free Sample",
    "abbr": "—",
    "meaning": "不收取样品费的样品",
    "usage": "Free sample, freight collect",
    "note": "运费到付是常见折中"
  },
  {
    "id": "10-20",
    "category": "10",
    "zh": "独家代理",
    "en": "Exclusive Agent",
    "abbr": "—",
    "meaning": "在特定区域独家销售的权利",
    "usage": "We are looking for an exclusive agent in Spain",
    "note": "须约定最低采购量"
  },
  {
    "id": "10-21",
    "category": "10",
    "zh": "代理商",
    "en": "Agent",
    "abbr": "—",
    "meaning": "代表卖方销售并收取佣金的主体",
    "usage": "Appointed a local agent",
    "note": ""
  },
  {
    "id": "10-22",
    "category": "10",
    "zh": "经销商",
    "en": "Distributor",
    "abbr": "—",
    "meaning": "买断货物再转售的中间商",
    "usage": "Distributor agreement for Southeast Asia",
    "note": ""
  },
  {
    "id": "10-23",
    "category": "10",
    "zh": "批发商",
    "en": "Wholesaler",
    "abbr": "—",
    "meaning": "大批量采购再分销的商家",
    "usage": "Wholesalers buy in bulk",
    "note": ""
  },
  {
    "id": "10-24",
    "category": "10",
    "zh": "零售商",
    "en": "Retailer",
    "abbr": "—",
    "meaning": "直接面向消费者的商家",
    "usage": "Retail chains require strict labeling",
    "note": ""
  },
  {
    "id": "10-25",
    "category": "10",
    "zh": "终端用户",
    "en": "End User",
    "abbr": "—",
    "meaning": "最终使用产品的一方",
    "usage": "End user certificate may be required",
    "note": "出口管制场景常需"
  },
  {
    "id": "10-26",
    "category": "10",
    "zh": "品牌商",
    "en": "Brand Owner",
    "abbr": "—",
    "meaning": "拥有产品品牌的企业",
    "usage": "We are the OEM supplier for a European brand owner",
    "note": ""
  },
  {
    "id": "10-27",
    "category": "10",
    "zh": "代工生产",
    "en": "Original Equipment Manufacturer",
    "abbr": "OEM",
    "meaning": "按客户品牌与设计要求生产",
    "usage": "OEM production for your brand",
    "note": ""
  },
  {
    "id": "10-28",
    "category": "10",
    "zh": "设计代工",
    "en": "Original Design Manufacturer",
    "abbr": "ODM",
    "meaning": "由制造商自主设计、客户贴牌",
    "usage": "ODM service with our own tooling",
    "note": ""
  },
  {
    "id": "10-29",
    "category": "10",
    "zh": "自有品牌",
    "en": "Private Label",
    "abbr": "—",
    "meaning": "零售商自有品牌产品",
    "usage": "Private label program for a US retailer",
    "note": ""
  },
  {
    "id": "10-30",
    "category": "10",
    "zh": "客户拜访",
    "en": "Customer Visit",
    "abbr": "—",
    "meaning": "拜访客户以深化合作",
    "usage": "We will visit your office in March",
    "note": ""
  },
  {
    "id": "10-31",
    "category": "10",
    "zh": "商务谈判",
    "en": "Business Negotiation",
    "abbr": "—",
    "meaning": "就交易条件进行磋商",
    "usage": "Negotiation on price and payment terms",
    "note": ""
  },
  {
    "id": "10-32",
    "category": "10",
    "zh": "让步",
    "en": "Concession",
    "abbr": "—",
    "meaning": "在谈判中作出的退让",
    "usage": "We can make a concession on the lead time",
    "note": "每次让步都要换取对等条件"
  },
  {
    "id": "10-33",
    "category": "10",
    "zh": "双赢",
    "en": "Win-win",
    "abbr": "—",
    "meaning": "双方都能获益的合作结果",
    "usage": "We aim for a win-win long-term partnership",
    "note": ""
  },
  {
    "id": "10-34",
    "category": "10",
    "zh": "长期合作",
    "en": "Long-term Cooperation",
    "abbr": "—",
    "meaning": "持续稳定的业务关系",
    "usage": "We look forward to long-term cooperation with you",
    "note": ""
  },
  {
    "id": "10-35",
    "category": "10",
    "zh": "框架协议",
    "en": "Framework Agreement",
    "abbr": "—",
    "meaning": "约定总体合作条件的协议",
    "usage": "Framework agreement valid for two years",
    "note": "具体订单另行签订"
  },
  {
    "id": "10-36",
    "category": "10",
    "zh": "客户满意度",
    "en": "Customer Satisfaction",
    "abbr": "—",
    "meaning": "客户对产品与服务的满意程度",
    "usage": "Customer satisfaction survey results",
    "note": ""
  },
  {
    "id": "10-37",
    "category": "10",
    "zh": "投诉",
    "en": "Complaint",
    "abbr": "—",
    "meaning": "客户对产品或服务的不满反映",
    "usage": "We received a complaint about the packaging",
    "note": "24 小时内响应是基本要求"
  },
  {
    "id": "10-38",
    "category": "10",
    "zh": "售后支持",
    "en": "After-sales Support",
    "abbr": "—",
    "meaning": "销售后提供的技术与服务支持",
    "usage": "After-sales support in local language",
    "note": ""
  },
  {
    "id": "10-39",
    "category": "10",
    "zh": "交货准时率",
    "en": "On-time Delivery Rate",
    "abbr": "OTD",
    "meaning": "按期交货订单占全部订单的比例",
    "usage": "OTD above 95%",
    "note": "客户考核供应商的核心指标"
  },
  {
    "id": "11-1",
    "category": "11",
    "zh": "合同",
    "en": "Contract",
    "abbr": "—",
    "meaning": "双方约定权利义务的协议",
    "usage": "The contract is governed by Chinese law",
    "note": ""
  },
  {
    "id": "11-2",
    "category": "11",
    "zh": "违约",
    "en": "Breach of Contract",
    "abbr": "—",
    "meaning": "一方未履行或未完全履行合同义务",
    "usage": "Breach of contract entitles the other party to damages",
    "note": ""
  },
  {
    "id": "11-3",
    "category": "11",
    "zh": "根本违约",
    "en": "Fundamental Breach",
    "abbr": "—",
    "meaning": "使对方蒙受实质损害、可解除合同的违约",
    "usage": "Late delivery constituted a fundamental breach",
    "note": "CISG 下的重要概念"
  },
  {
    "id": "11-4",
    "category": "11",
    "zh": "损害赔偿",
    "en": "Damages",
    "abbr": "—",
    "meaning": "对因违约造成的损失进行赔偿",
    "usage": "Damages of USD 20,000 claimed",
    "note": ""
  },
  {
    "id": "11-5",
    "category": "11",
    "zh": "违约金",
    "en": "Liquidated Damages",
    "abbr": "—",
    "meaning": "合同预先约定的违约赔偿金额",
    "usage": "Liquidated damages of 0.5% per week of delay",
    "note": "过高可能被法院调减"
  },
  {
    "id": "11-6",
    "category": "11",
    "zh": "实际履行",
    "en": "Specific Performance",
    "abbr": "—",
    "meaning": "要求违约方按约实际履行义务",
    "usage": "Buyer sought specific performance",
    "note": ""
  },
  {
    "id": "11-7",
    "category": "11",
    "zh": "不可抗力",
    "en": "Force Majeure",
    "abbr": "—",
    "meaning": "不能预见、不能避免且不能克服的客观情况",
    "usage": "The delay was caused by force majeure",
    "note": "须及时通知并取证"
  },
  {
    "id": "11-8",
    "category": "11",
    "zh": "免责",
    "en": "Exemption",
    "abbr": "—",
    "meaning": "免除违约方责任的情形",
    "usage": "Exemption applies only to force majeure events",
    "note": ""
  },
  {
    "id": "11-9",
    "category": "11",
    "zh": "合同落空",
    "en": "Frustration of Contract",
    "abbr": "—",
    "meaning": "因意外事件使合同目的无法实现",
    "usage": "Doctrine of frustration",
    "note": "与不可抗力相近但认定更严"
  },
  {
    "id": "11-10",
    "category": "11",
    "zh": "仲裁",
    "en": "Arbitration",
    "abbr": "—",
    "meaning": "由中立第三方裁决争议的方式",
    "usage": "Disputes shall be settled by arbitration",
    "note": "比诉讼更常用、更保密"
  },
  {
    "id": "11-11",
    "category": "11",
    "zh": "仲裁机构",
    "en": "Arbitration Institution",
    "abbr": "—",
    "meaning": "受理仲裁案件的机构",
    "usage": "CIETAC, HKIAC, SIAC",
    "note": "条款须写明机构全称"
  },
  {
    "id": "11-12",
    "category": "11",
    "zh": "仲裁裁决",
    "en": "Arbitral Award",
    "abbr": "—",
    "meaning": "仲裁庭作出的终局裁决",
    "usage": "The arbitral award is final and binding",
    "note": "可依纽约公约执行"
  },
  {
    "id": "11-13",
    "category": "11",
    "zh": "诉讼",
    "en": "Litigation",
    "abbr": "—",
    "meaning": "通过法院解决争议",
    "usage": "Litigation in the buyer's country is costly",
    "note": ""
  },
  {
    "id": "11-14",
    "category": "11",
    "zh": "管辖权",
    "en": "Jurisdiction",
    "abbr": "—",
    "meaning": "法院或仲裁机构受理案件的权限",
    "usage": "The court has jurisdiction over the dispute",
    "note": ""
  },
  {
    "id": "11-15",
    "category": "11",
    "zh": "联合国国际货物销售合同公约",
    "en": "CISG",
    "abbr": "CISG",
    "meaning": "规范国际货物买卖的统一法公约",
    "usage": "CISG applies unless excluded",
    "note": "中国、美国等为主要缔约国"
  },
  {
    "id": "11-16",
    "category": "11",
    "zh": "反倾销",
    "en": "Anti-dumping",
    "abbr": "—",
    "meaning": "针对低价倾销采取的贸易救济措施",
    "usage": "Anti-dumping investigation on solar panels",
    "note": ""
  },
  {
    "id": "11-17",
    "category": "11",
    "zh": "反补贴",
    "en": "Countervailing",
    "abbr": "—",
    "meaning": "针对政府补贴采取的贸易救济措施",
    "usage": "Countervailing measures imposed",
    "note": ""
  },
  {
    "id": "11-18",
    "category": "11",
    "zh": "保障措施",
    "en": "Safeguard Measures",
    "abbr": "—",
    "meaning": "进口激增时采取的临时限制措施",
    "usage": "Safeguard measures on steel imports",
    "note": ""
  },
  {
    "id": "11-19",
    "category": "11",
    "zh": "301 调查",
    "en": "Section 301 Investigation",
    "abbr": "—",
    "meaning": "美国依据 301 条款发起的贸易调查",
    "usage": "Additional tariffs under Section 301",
    "note": "清单与税率会调整"
  },
  {
    "id": "11-20",
    "category": "11",
    "zh": "出口管制",
    "en": "Export Control",
    "abbr": "—",
    "meaning": "对特定物项与技术出口的限制",
    "usage": "Dual-use items are subject to export control",
    "note": "违规后果严重"
  },
  {
    "id": "11-21",
    "category": "11",
    "zh": "两用物项",
    "en": "Dual-use Items",
    "abbr": "—",
    "meaning": "既可民用也可军用的物项与技术",
    "usage": "Dual-use export licence required",
    "note": ""
  },
  {
    "id": "11-22",
    "category": "11",
    "zh": "制裁",
    "en": "Sanctions",
    "abbr": "—",
    "meaning": "一国对另一国或实体的限制措施",
    "usage": "Sanctions screening before shipment",
    "note": "付款前必查名单"
  },
  {
    "id": "11-23",
    "category": "11",
    "zh": "实体清单",
    "en": "Entity List",
    "abbr": "—",
    "meaning": "美国限制出口的实体名单",
    "usage": "The company was added to the Entity List",
    "note": ""
  },
  {
    "id": "11-24",
    "category": "11",
    "zh": "知识产权",
    "en": "Intellectual Property Rights",
    "abbr": "IPR",
    "meaning": "商标、专利、著作权等权利",
    "usage": "IPR infringement claims",
    "note": "代工订单须确认授权"
  },
  {
    "id": "11-25",
    "category": "11",
    "zh": "商标",
    "en": "Trademark",
    "abbr": "—",
    "meaning": "区别商品来源的标识",
    "usage": "Trademark registration in the target market",
    "note": "贴牌前核查客户商标权属"
  },
  {
    "id": "11-26",
    "category": "11",
    "zh": "专利",
    "en": "Patent",
    "abbr": "—",
    "meaning": "对发明创造享有的专有权",
    "usage": "Design patent infringement",
    "note": ""
  },
  {
    "id": "11-27",
    "category": "11",
    "zh": "侵权",
    "en": "Infringement",
    "abbr": "—",
    "meaning": "未经许可使用他人权利",
    "usage": "Customs seized goods for infringement",
    "note": ""
  },
  {
    "id": "11-28",
    "category": "11",
    "zh": "海关知识产权备案",
    "en": "Customs IPR Recordal",
    "abbr": "—",
    "meaning": "在海关备案以便查扣侵权货物",
    "usage": "File a customs IPR recordal",
    "note": "备案后可主动查扣"
  },
  {
    "id": "11-29",
    "category": "11",
    "zh": "合规",
    "en": "Compliance",
    "abbr": "—",
    "meaning": "遵守法律法规与内部制度",
    "usage": "Compliance training for sales staff",
    "note": ""
  },
  {
    "id": "11-30",
    "category": "11",
    "zh": "反腐败",
    "en": "Anti-bribery",
    "abbr": "—",
    "meaning": "禁止以财物换取商业利益",
    "usage": "Zero tolerance for bribery",
    "note": ""
  },
  {
    "id": "11-31",
    "category": "11",
    "zh": "美国海外反腐败法",
    "en": "Foreign Corrupt Practices Act",
    "abbr": "FCPA",
    "meaning": "美国反商业贿赂法律",
    "usage": "FCPA applies to foreign subsidiaries",
    "note": "长臂管辖，务必注意"
  },
  {
    "id": "11-32",
    "category": "11",
    "zh": "尽职调查",
    "en": "Due Diligence",
    "abbr": "—",
    "meaning": "交易前对对方的资信调查",
    "usage": "Credit due diligence on the new buyer",
    "note": ""
  },
  {
    "id": "11-33",
    "category": "11",
    "zh": "信用保险",
    "en": "Credit Insurance",
    "abbr": "—",
    "meaning": "承保买方不付款风险的保险",
    "usage": "Export credit insurance covers 90% of the loss",
    "note": ""
  },
  {
    "id": "11-34",
    "category": "11",
    "zh": "中国出口信用保险公司",
    "en": "SINOSURE",
    "abbr": "SINOSURE",
    "meaning": "中国政策性出口信用保险机构",
    "usage": "SINOSURE policy for the African market",
    "note": ""
  },
  {
    "id": "11-35",
    "category": "11",
    "zh": "汇率风险",
    "en": "Exchange Rate Risk",
    "abbr": "—",
    "meaning": "汇率波动造成的损益不确定性",
    "usage": "Hedge the exchange rate risk",
    "note": ""
  },
  {
    "id": "11-36",
    "category": "11",
    "zh": "套期保值",
    "en": "Hedging",
    "abbr": "—",
    "meaning": "通过金融工具锁定汇率或价格",
    "usage": "Forward contract for hedging",
    "note": ""
  },
  {
    "id": "11-37",
    "category": "11",
    "zh": "供应链风险",
    "en": "Supply Chain Risk",
    "abbr": "—",
    "meaning": "供应链中断或成本波动的风险",
    "usage": "Diversify to reduce supply chain risk",
    "note": "近岸外包趋势明显"
  },
  {
    "id": "12-1",
    "category": "12",
    "zh": "按照、根据",
    "en": "as per",
    "abbr": "—",
    "meaning": "引用合同、发票、指示等依据",
    "usage": "As per your request, we have adjusted the packing",
    "note": "商务信函高频，比 according to 更正式"
  },
  {
    "id": "12-2",
    "category": "12",
    "zh": "以…为条件；以…为准",
    "en": "subject to",
    "abbr": "—",
    "meaning": "表示某项保留或前提条件",
    "usage": "The offer is subject to our final confirmation",
    "note": "虚盘、报价保留的标配表达"
  },
  {
    "id": "12-3",
    "category": "12",
    "zh": "以我方最后确认为准",
    "en": "subject to our final confirmation",
    "abbr": "—",
    "meaning": "报价不构成实盘时的保留语",
    "usage": "Prices are subject to our final confirmation",
    "note": "保护自己，避免被认定实盘"
  },
  {
    "id": "12-4",
    "category": "12",
    "zh": "一式两份",
    "en": "in duplicate",
    "abbr": "—",
    "meaning": "单据制作两份",
    "usage": "Please sign and return the contract in duplicate",
    "note": "三份为 in triplicate，四份 in quadruplicate"
  },
  {
    "id": "12-5",
    "category": "12",
    "zh": "一式三份",
    "en": "in triplicate",
    "abbr": "—",
    "meaning": "单据制作三份",
    "usage": "Commercial invoice in triplicate",
    "note": "信用证常要求 in triplicate"
  },
  {
    "id": "12-6",
    "category": "12",
    "zh": "即期",
    "en": "at sight",
    "abbr": "—",
    "meaning": "见票即付",
    "usage": "L/C at sight",
    "note": "远期用 at 60/90 days after sight"
  },
  {
    "id": "12-7",
    "category": "12",
    "zh": "不迟于",
    "en": "no later than",
    "abbr": "—",
    "meaning": "规定最后期限",
    "usage": "Shipment no later than 30 June",
    "note": "比 before 更明确"
  },
  {
    "id": "12-8",
    "category": "12",
    "zh": "随函附上",
    "en": "please find attached",
    "abbr": "—",
    "meaning": "邮件附件引导语",
    "usage": "Please find attached our quotation for your reference",
    "note": "也可用 enclosed please find（纸质函件）"
  },
  {
    "id": "12-9",
    "category": "12",
    "zh": "兹通知",
    "en": "we hereby inform you that",
    "abbr": "—",
    "meaning": "正式通知的开头",
    "usage": "We hereby inform you that the goods have been shipped",
    "note": "法律文书、正式函件常用"
  },
  {
    "id": "12-10",
    "category": "12",
    "zh": "关于",
    "en": "with regard to",
    "abbr": "—",
    "meaning": "引出话题",
    "usage": "With regard to your inquiry of 5 May",
    "note": "比 about 正式"
  },
  {
    "id": "12-11",
    "category": "12",
    "zh": "以…为受益人",
    "en": "in favour of",
    "abbr": "—",
    "meaning": "指定受益方",
    "usage": "The L/C is opened in favour of our company",
    "note": ""
  },
  {
    "id": "12-12",
    "category": "12",
    "zh": "对…负责",
    "en": "be liable for",
    "abbr": "—",
    "meaning": "承担法律或经济责任",
    "usage": "The seller shall be liable for any delay",
    "note": "合同责任条款常用"
  },
  {
    "id": "12-13",
    "category": "12",
    "zh": "与样品一致",
    "en": "be in conformity with the sample",
    "abbr": "—",
    "meaning": "货物须符合样品标准",
    "usage": "The goods must be in conformity with the approved sample",
    "note": "也可用 comply with"
  },
  {
    "id": "12-14",
    "category": "12",
    "zh": "保留索赔权",
    "en": "reserve the right to claim",
    "abbr": "—",
    "meaning": "暂不索赔但不放弃权利",
    "usage": "We reserve the right to claim for any loss",
    "note": "处理纠纷时的标准表述"
  },
  {
    "id": "12-15",
    "category": "12",
    "zh": "作为补偿",
    "en": "in compensation for",
    "abbr": "—",
    "meaning": "以某物弥补损失",
    "usage": "We offer a 3% discount in compensation for the delay",
    "note": ""
  },
  {
    "id": "12-16",
    "category": "12",
    "zh": "鉴于",
    "en": "in view of",
    "abbr": "—",
    "meaning": "说明理由或背景",
    "usage": "In view of our long-term cooperation, we accept your price",
    "note": ""
  },
  {
    "id": "12-17",
    "category": "12",
    "zh": "尽最大努力",
    "en": "use our best efforts",
    "abbr": "—",
    "meaning": "承诺尽力而非保证结果",
    "usage": "We will use our best efforts to advance the shipment",
    "note": "避免写成 guarantee"
  },
  {
    "id": "12-18",
    "category": "12",
    "zh": "不可撤销地",
    "en": "irrevocably",
    "abbr": "—",
    "meaning": "表示不可撤回的承诺",
    "usage": "We irrevocably agree to the amendment",
    "note": ""
  },
  {
    "id": "12-19",
    "category": "12",
    "zh": "分批装运",
    "en": "partial shipment",
    "abbr": "—",
    "meaning": "分多批装运",
    "usage": "Partial shipment is not allowed",
    "note": "须与信用证一致"
  },
  {
    "id": "12-20",
    "category": "12",
    "zh": "允许转运",
    "en": "transshipment allowed",
    "abbr": "—",
    "meaning": "允许中途换船",
    "usage": "Transshipment allowed at Singapore",
    "note": "不允许则写 not allowed"
  },
  {
    "id": "12-21",
    "category": "12",
    "zh": "见票后 90 天付款",
    "en": "at 90 days after sight",
    "abbr": "—",
    "meaning": "远期汇票的付款期限",
    "usage": "Draft at 90 days after sight",
    "note": ""
  },
  {
    "id": "12-22",
    "category": "12",
    "zh": "出厂价",
    "en": "ex-works price",
    "abbr": "—",
    "meaning": "工厂交货价",
    "usage": "Our ex-works price is USD 8.90 per unit",
    "note": ""
  },
  {
    "id": "12-23",
    "category": "12",
    "zh": "成本加运费价",
    "en": "CFR price",
    "abbr": "—",
    "meaning": "含运费至目的港的价格",
    "usage": "CFR Hamburg price: USD 11.20",
    "note": ""
  },
  {
    "id": "12-24",
    "category": "12",
    "zh": "完税后交货",
    "en": "DDP",
    "abbr": "—",
    "meaning": "卖方承担关税的交货方式",
    "usage": "DDP price including all duties and taxes",
    "note": "报价必须包含目的国税费"
  },
  {
    "id": "12-25",
    "category": "12",
    "zh": "以…为包装单位",
    "en": "packed in",
    "abbr": "—",
    "meaning": "说明包装方式",
    "usage": "Packed in export cartons of 20 pcs",
    "note": ""
  },
  {
    "id": "12-26",
    "category": "12",
    "zh": "由…承担费用",
    "en": "at the expense of",
    "abbr": "—",
    "meaning": "明确费用承担方",
    "usage": "Any bank charges outside China are at the buyer's expense",
    "note": "费用争议的预防条款"
  },
  {
    "id": "12-27",
    "category": "12",
    "zh": "按发票金额的 110% 投保",
    "en": "insure for 110% of the invoice value",
    "abbr": "—",
    "meaning": "CIF 保险金额的惯例",
    "usage": "Insurance to be effected for 110% of the invoice value",
    "note": ""
  }
]

export const GLOSSARY_PHRASES: GlossaryPhrase[] = [
  {
    "id": "P-1",
    "scene": "开发信开场",
    "zh": "我们是…的专业制造商",
    "en": "We are a professional manufacturer of [product] with over [X] years of experience.",
    "tip": "第一句就说清'你是谁+做什么+凭什么可信'，别铺陈"
  },
  {
    "id": "P-2",
    "scene": "说明客户来源",
    "zh": "我们在展会上见过",
    "en": "We met at the Canton Fair last month, where we discussed [product].",
    "tip": "有共同场景的邮件打开率最高"
  },
  {
    "id": "P-3",
    "scene": "自我介绍",
    "zh": "我负责贵司所在市场",
    "en": "I am responsible for the European market at [company].",
    "tip": "让客户知道找谁能负责"
  },
  {
    "id": "P-4",
    "scene": "首次报价",
    "zh": "随函附上报价单",
    "en": "Please find attached our quotation sheet for your reference.",
    "tip": "附件命名写清产品+日期+版本"
  },
  {
    "id": "P-5",
    "scene": "回复询盘",
    "zh": "感谢询盘，现回复如下",
    "en": "Thank you for your inquiry dated [date]. We are pleased to quote as follows.",
    "tip": "引用日期，方便双方对账"
  },
  {
    "id": "P-6",
    "scene": "提供折扣",
    "zh": "量大可享折扣",
    "en": "We can offer a [X]% discount for orders exceeding [qty] pieces.",
    "tip": "折扣与数量绑定，别白给"
  },
  {
    "id": "P-7",
    "scene": "拒绝降价",
    "zh": "很抱歉无法接受该价格",
    "en": "We appreciate your feedback, but we regret that we are unable to accept the target price of USD [X].",
    "tip": "拒绝后必须给理由+替代方案"
  },
  {
    "id": "P-8",
    "scene": "给出替代方案",
    "zh": "建议调整规格以匹配预算",
    "en": "May we suggest an alternative specification that better fits your budget?",
    "tip": "把'不行'变成'这样可以'"
  },
  {
    "id": "P-9",
    "scene": "确认订单",
    "zh": "确认收到订单",
    "en": "We are pleased to confirm receipt of your order No. [X] and will proceed accordingly.",
    "tip": "确认时把关键条款复述一遍"
  },
  {
    "id": "P-10",
    "scene": "发送形式发票",
    "zh": "附上 PI 供付款",
    "en": "Please find attached our proforma invoice for payment arrangement.",
    "tip": "PI 上写清银行信息与付款期限"
  },
  {
    "id": "P-11",
    "scene": "催开信用证",
    "zh": "请尽快开立信用证",
    "en": "As the shipment date is approaching, could you please arrange the L/C at your earliest convenience?",
    "tip": "提前 2-3 周催，留出改证时间"
  },
  {
    "id": "P-12",
    "scene": "催预付款",
    "zh": "请安排订金",
    "en": "Kindly arrange the 30% deposit so that we can start production as scheduled.",
    "tip": "说明不付订金的具体后果"
  },
  {
    "id": "P-13",
    "scene": "催尾款",
    "zh": "请付清余款以便放单",
    "en": "Please arrange the balance payment; we will release the original documents upon receipt.",
    "tip": "先款后单，不要提前电放"
  },
  {
    "id": "P-14",
    "scene": "通知生产完成",
    "zh": "货已备妥",
    "en": "We are glad to inform you that your order is ready for shipment.",
    "tip": "附验货照片更有说服力"
  },
  {
    "id": "P-15",
    "scene": "通知出货",
    "zh": "已装船并附单据",
    "en": "The goods were shipped on board [vessel/voyage] on [date]. Copies of the documents are attached.",
    "tip": "船名、航次、ETD、提单号四项齐全"
  },
  {
    "id": "P-16",
    "scene": "延误道歉",
    "zh": "抱歉交期延误",
    "en": "We sincerely apologize for the delay, which was caused by [reason]. The new ETD is [date].",
    "tip": "道歉+原因+新时间+补偿方案，四件套"
  },
  {
    "id": "P-17",
    "scene": "质量问题致歉",
    "zh": "对质量问题深表歉意",
    "en": "We are very sorry to learn about the quality issue and have launched an immediate investigation.",
    "tip": "不要先辩解，先接住情绪"
  },
  {
    "id": "P-18",
    "scene": "提出索赔",
    "zh": "就货损提出索赔",
    "en": "We regret to inform you that [X]% of the goods arrived damaged, and we hereby lodge a claim for USD [X].",
    "tip": "附检验报告与照片，金额有依据"
  },
  {
    "id": "P-19",
    "scene": "回应索赔",
    "zh": "接受/协商索赔",
    "en": "We accept your claim in principle and propose a settlement of USD [X] by way of [credit note/replacement].",
    "tip": "给方案而不是只争论责任"
  },
  {
    "id": "P-20",
    "scene": "索要样品",
    "zh": "请寄样品",
    "en": "Could you please send us [X] pcs of samples for evaluation? We will cover the courier cost.",
    "tip": "主动承担运费，成功率更高"
  },
  {
    "id": "P-21",
    "scene": "寄样通知",
    "zh": "样品已寄出",
    "en": "The samples were dispatched by DHL today, tracking No. [X].",
    "tip": "附单号，减少来回追问"
  },
  {
    "id": "P-22",
    "scene": "安排验货",
    "zh": "请安排验货",
    "en": "Please advise when your inspector will visit so that we can prepare the goods.",
    "tip": "提前 1 周约，避免工厂排期冲突"
  },
  {
    "id": "P-23",
    "scene": "邀请参观工厂",
    "zh": "欢迎来访",
    "en": "We would be delighted to welcome you to our factory. Please let us know your schedule.",
    "tip": "附工厂地址与最近机场"
  },
  {
    "id": "P-24",
    "scene": "确认规格",
    "zh": "请确认规格",
    "en": "Could you please confirm the specification in the attached drawing before we proceed?",
    "tip": "书面确认，避免口头扯皮"
  },
  {
    "id": "P-25",
    "scene": "包装变更",
    "zh": "确认包装调整",
    "en": "As requested, we have changed the packing to [X]. Please confirm it meets your requirement.",
    "tip": ""
  },
  {
    "id": "P-26",
    "scene": "汇率调价",
    "zh": "因汇率波动调整价格",
    "en": "Due to the significant exchange rate fluctuation, we regret to advise a price adjustment of [X]% effective [date].",
    "tip": "提前通知+给老订单过渡期"
  },
  {
    "id": "P-27",
    "scene": "补寄单据",
    "zh": "补寄缺失单据",
    "en": "We have couriered the missing certificate of origin; please find the tracking number below.",
    "tip": ""
  },
  {
    "id": "P-28",
    "scene": "建立长期合作",
    "zh": "期待长期合作",
    "en": "We look forward to building a long-term partnership with you.",
    "tip": "结尾一句即可，不要长篇抒情"
  },
  {
    "id": "P-29",
    "scene": "休假通知",
    "zh": "假期安排告知",
    "en": "Please be advised that our office will be closed from [date] to [date] for the public holiday.",
    "tip": "提前一周发，附紧急联系人"
  },
  {
    "id": "P-30",
    "scene": "通用结尾",
    "zh": "如有疑问请随时联系",
    "en": "Should you have any questions, please do not hesitate to contact us.",
    "tip": "比 Waiting for your reply 更礼貌"
  },
  {
    "id": "P-31",
    "scene": "催促回复",
    "zh": "期待您的回复",
    "en": "We look forward to your early reply so that we can move forward.",
    "tip": "第二次跟进可加具体时间点"
  }
]

export const GLOSSARY_ABBR: GlossaryAbbr[] = [
  {
    "abbr": "缩写",
    "full": "英文全称",
    "zh": "中文",
    "group": "所属分类"
  },
  {
    "abbr": "0110",
    "full": "General Trade Code",
    "zh": "一般贸易代码",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "20GP",
    "full": "20-foot General Purpose Container",
    "zh": "20 尺普柜",
    "group": "包装·唛头·重量"
  },
  {
    "abbr": "40GP",
    "full": "40-foot General Purpose Container",
    "zh": "40 尺普柜",
    "group": "包装·唛头·重量"
  },
  {
    "abbr": "40HQ",
    "full": "40-foot High Cube Container",
    "zh": "40 尺高柜",
    "group": "包装·唛头·重量"
  },
  {
    "abbr": "9610",
    "full": "Cross-border E-commerce Retail Export",
    "zh": "跨境电商零售出口",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "9710",
    "full": "Cross-border B2B Direct Export",
    "zh": "跨境电商 B2B 出口",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "9810",
    "full": "Cross-border E-commerce Overseas Warehouse",
    "zh": "跨境电商海外仓",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "AEO",
    "full": "Authorized Economic Operator",
    "zh": "AEO 认证",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "AQL",
    "full": "Acceptance Quality Limit",
    "zh": "接收质量限",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "AWB",
    "full": "Air Waybill",
    "zh": "空运单",
    "group": "运输·物流·提单"
  },
  {
    "abbr": "B/L",
    "full": "Bill of Lading",
    "zh": "提单",
    "group": "运输·物流·提单"
  },
  {
    "abbr": "BAF",
    "full": "Bunker Adjustment Factor",
    "zh": "燃油附加费",
    "group": "价格·成本·佣金"
  },
  {
    "abbr": "C/O",
    "full": "Certificate of Origin",
    "zh": "原产地证",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "CAF",
    "full": "Currency Adjustment Factor",
    "zh": "货币贬值附加费",
    "group": "价格·成本·佣金"
  },
  {
    "abbr": "CAPA",
    "full": "Corrective and Preventive Action",
    "zh": "纠正预防措施",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "CBM",
    "full": "Measurement",
    "zh": "体积",
    "group": "包装·唛头·重量"
  },
  {
    "abbr": "CCC",
    "full": "China Compulsory Certification",
    "zh": "3C 认证",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "CE",
    "full": "CE Marking",
    "zh": "CE 认证",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "CFR",
    "full": "Cost and Freight",
    "zh": "成本加运费",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "CFS",
    "full": "Container Freight Station",
    "zh": "集装箱货运站",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "CI",
    "full": "Commercial Invoice",
    "zh": "商业发票",
    "group": "询盘·报价·合同"
  },
  {
    "abbr": "CIF",
    "full": "Cost, Insurance and Freight",
    "zh": "成本、保险费加运费",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "CIP",
    "full": "Carriage and Insurance Paid To",
    "zh": "运费、保险费付至",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "CISG",
    "full": "CISG",
    "zh": "联合国国际货物销售合同公约",
    "group": "风险·合规·法律"
  },
  {
    "abbr": "CPT",
    "full": "Carriage Paid To",
    "zh": "运费付至",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "CVD",
    "full": "Countervailing Duty",
    "zh": "反补贴税",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "CY",
    "full": "Container Yard",
    "zh": "集装箱堆场",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "D/A",
    "full": "Documents against Acceptance",
    "zh": "承兑交单",
    "group": "支付·结算·信用证"
  },
  {
    "abbr": "D/O",
    "full": "Delivery Order",
    "zh": "提货单",
    "group": "运输·物流·提单"
  },
  {
    "abbr": "D/P",
    "full": "Documents against Payment",
    "zh": "付款交单",
    "group": "支付·结算·信用证"
  },
  {
    "abbr": "D/R",
    "full": "Dock Receipt",
    "zh": "码头收据",
    "group": "运输·物流·提单"
  },
  {
    "abbr": "DAP",
    "full": "Delivered at Place",
    "zh": "目的地交货",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "DDP",
    "full": "Delivered Duty Paid",
    "zh": "完税后交货",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "DPU",
    "full": "Delivered at Place Unloaded",
    "zh": "卸货地交货",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "Draft",
    "full": "Bill of Exchange",
    "zh": "汇票",
    "group": "支付·结算·信用证"
  },
  {
    "abbr": "ETA",
    "full": "Estimated Time of Arrival",
    "zh": "预计到港时间",
    "group": "运输·物流·提单"
  },
  {
    "abbr": "ETD",
    "full": "Estimated Time of Departure",
    "zh": "预计开船时间",
    "group": "运输·物流·提单"
  },
  {
    "abbr": "EXW",
    "full": "Ex Works",
    "zh": "工厂交货",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "EXW",
    "full": "Ex-works Price",
    "zh": "出厂价",
    "group": "价格·成本·佣金"
  },
  {
    "abbr": "FAI",
    "full": "First Article Inspection",
    "zh": "首件确认",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "FAS",
    "full": "Free Alongside Ship",
    "zh": "船边交货",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "FCA",
    "full": "Free Carrier",
    "zh": "货交承运人",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "FCC",
    "full": "FCC Certification",
    "zh": "FCC 认证",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "FCL",
    "full": "Full Container Load",
    "zh": "整箱",
    "group": "运输·物流·提单"
  },
  {
    "abbr": "FCPA",
    "full": "Foreign Corrupt Practices Act",
    "zh": "美国海外反腐败法",
    "group": "风险·合规·法律"
  },
  {
    "abbr": "FDA",
    "full": "FDA Registration",
    "zh": "FDA 注册",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "FOB",
    "full": "Free On Board",
    "zh": "装运港船上交货",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "FORM A",
    "full": "Form A",
    "zh": "普惠制产地证",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "FORM E",
    "full": "Form E",
    "zh": "中国-东盟原产地证",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "FPA",
    "full": "Free from Particular Average",
    "zh": "平安险",
    "group": "保险·索赔"
  },
  {
    "abbr": "G.W.",
    "full": "Gross Weight",
    "zh": "毛重",
    "group": "包装·唛头·重量"
  },
  {
    "abbr": "HS Code",
    "full": "Harmonized System Code",
    "zh": "HS 编码",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "IPPC",
    "full": "IPPC Mark",
    "zh": "木质包装标识",
    "group": "包装·唛头·重量"
  },
  {
    "abbr": "IPR",
    "full": "Intellectual Property Rights",
    "zh": "知识产权",
    "group": "风险·合规·法律"
  },
  {
    "abbr": "ISBP",
    "full": "ISBP",
    "zh": "国际标准银行实务",
    "group": "支付·结算·信用证"
  },
  {
    "abbr": "ISO 9001",
    "full": "ISO 9001",
    "zh": "ISO 9001",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "L/C",
    "full": "Letter of Credit",
    "zh": "信用证",
    "group": "支付·结算·信用证"
  },
  {
    "abbr": "L/G",
    "full": "Letter of Guarantee",
    "zh": "银行保函",
    "group": "支付·结算·信用证"
  },
  {
    "abbr": "LCL",
    "full": "Less than Container Load",
    "zh": "拼箱",
    "group": "运输·物流·提单"
  },
  {
    "abbr": "MFN",
    "full": "Most-Favoured-Nation Rate",
    "zh": "最惠国税率",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "MOQ",
    "full": "Minimum Order Quantity",
    "zh": "起订量",
    "group": "客户·谈判·沟通"
  },
  {
    "abbr": "N.W.",
    "full": "Net Weight",
    "zh": "净重",
    "group": "包装·唛头·重量"
  },
  {
    "abbr": "NVOCC",
    "full": "Non-Vessel Operating Common Carrier",
    "zh": "无船承运人",
    "group": "运输·物流·提单"
  },
  {
    "abbr": "O/A",
    "full": "Open Account",
    "zh": "赊销",
    "group": "支付·结算·信用证"
  },
  {
    "abbr": "ODM",
    "full": "Original Design Manufacturer",
    "zh": "设计代工",
    "group": "客户·谈判·沟通"
  },
  {
    "abbr": "OEM",
    "full": "Original Equipment Manufacturer",
    "zh": "代工生产",
    "group": "客户·谈判·沟通"
  },
  {
    "abbr": "OTD",
    "full": "On-time Delivery Rate",
    "zh": "交货准时率",
    "group": "客户·谈判·沟通"
  },
  {
    "abbr": "P/L",
    "full": "Packing List",
    "zh": "装箱单",
    "group": "包装·唛头·重量"
  },
  {
    "abbr": "PI",
    "full": "Proforma Invoice",
    "zh": "形式发票",
    "group": "询盘·报价·合同"
  },
  {
    "abbr": "Pkgs",
    "full": "Number of Packages",
    "zh": "件数",
    "group": "包装·唛头·重量"
  },
  {
    "abbr": "PO",
    "full": "Purchase Order",
    "zh": "采购订单",
    "group": "询盘·报价·合同"
  },
  {
    "abbr": "POD",
    "full": "Port of Destination",
    "zh": "目的港",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "POL",
    "full": "Port of Loading",
    "zh": "装运港",
    "group": "贸易术语 Incoterms"
  },
  {
    "abbr": "PSI",
    "full": "Pre-shipment Inspection",
    "zh": "出货前检验",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "PSS",
    "full": "Peak Season Surcharge",
    "zh": "旺季附加费",
    "group": "价格·成本·佣金"
  },
  {
    "abbr": "QA",
    "full": "Quality Assurance",
    "zh": "质量保证",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "QC",
    "full": "Quality Control",
    "zh": "质量控制",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "QMS",
    "full": "Quality Management System",
    "zh": "质量管理体系",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "Qty",
    "full": "Quantity",
    "zh": "数量",
    "group": "询盘·报价·合同"
  },
  {
    "abbr": "REACH",
    "full": "REACH Regulation",
    "zh": "REACH 法规",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "RoHS",
    "full": "RoHS Directive",
    "zh": "RoHS 指令",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "RVC",
    "full": "Regional Value Content",
    "zh": "区域价值成分",
    "group": "报关·退税·原产地"
  },
  {
    "abbr": "S/C",
    "full": "Sales Contract",
    "zh": "销售合同",
    "group": "询盘·报价·合同"
  },
  {
    "abbr": "S/C",
    "full": "Sales Confirmation",
    "zh": "销售确认书",
    "group": "询盘·报价·合同"
  },
  {
    "abbr": "SBLC",
    "full": "Standby L/C",
    "zh": "备用信用证",
    "group": "支付·结算·信用证"
  },
  {
    "abbr": "SDS",
    "full": "Safety Data Sheet",
    "zh": "化学品安全说明书",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "SINOSURE",
    "full": "SINOSURE",
    "zh": "中国出口信用保险公司",
    "group": "风险·合规·法律"
  },
  {
    "abbr": "Spec",
    "full": "Specification",
    "zh": "规格",
    "group": "询盘·报价·合同"
  },
  {
    "abbr": "SWIFT",
    "full": "Society for Worldwide Interbank Financial Telecommunication",
    "zh": "SWIFT",
    "group": "支付·结算·信用证"
  },
  {
    "abbr": "T&C",
    "full": "Terms and Conditions",
    "zh": "合同条款",
    "group": "询盘·报价·合同"
  },
  {
    "abbr": "T/T",
    "full": "Telegraphic Transfer",
    "zh": "电汇",
    "group": "支付·结算·信用证"
  },
  {
    "abbr": "THC",
    "full": "Terminal Handling Charge",
    "zh": "码头操作费",
    "group": "价格·成本·佣金"
  },
  {
    "abbr": "TPND",
    "full": "Theft, Pilferage and Non-Delivery",
    "zh": "偷窃提货不着险",
    "group": "保险·索赔"
  },
  {
    "abbr": "UCP600",
    "full": "UCP 600",
    "zh": "跟单信用证统一惯例",
    "group": "支付·结算·信用证"
  },
  {
    "abbr": "UL",
    "full": "UL Certification",
    "zh": "UL 认证",
    "group": "质量·验货·认证"
  },
  {
    "abbr": "W/W",
    "full": "Warehouse to Warehouse Clause",
    "zh": "仓至仓条款",
    "group": "保险·索赔"
  },
  {
    "abbr": "WPA / WA",
    "full": "With Particular Average",
    "zh": "水渍险",
    "group": "保险·索赔"
  },
  {
    "abbr": "前T/T",
    "full": "T/T in Advance",
    "zh": "预付货款",
    "group": "支付·结算·信用证"
  },
  {
    "abbr": "后T/T",
    "full": "T/T after Shipment",
    "zh": "货到付款",
    "group": "支付·结算·信用证"
  }
]

export const GLOSSARY_TOTAL = GLOSSARY_TERMS.length + GLOSSARY_PHRASES.length + GLOSSARY_ABBR.length
