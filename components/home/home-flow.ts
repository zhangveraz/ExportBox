// 名称: 首页业务流分类
// 描述: 按真实外贸业务流把 51 个工具归成 6 段（询盘 → 报价 → 收款 → 出货 → 单证 → 效率），只用于首页展示
// 路径: ExportBox/components/home/home-flow.ts
// 作者: ExportBox
// 更新时间: 2026-11-03

export type HomeFlowStage = {
  /** 锚点 id，供首页内跳转与外部深链使用 */
  id: string
  /** 阶段名 */
  label: string
  /** 一句话说明这一阶段在做什么 */
  summary: string
  /** 该阶段包含的工具 slug，按「核心 → 次要」排列 */
  slugs: readonly string[]
}

/**
 * 首页按业务流排序，不看工具的技术类型。
 * 每个 slug 必须且只能出现在一个阶段里（scripts/assert-home-flow.cjs 会校验）。
 */
export const HOME_FLOW_STAGES: readonly HomeFlowStage[] = [
  {
    id: 'flow-1',
    label: '询盘与沟通',
    summary: '客户还没下单：先判断询盘值不值得跟，再把话说专业、回得及时。',
    slugs: [
      'inquiry-priority-scorer',
      'email-phrase-library',
      'glossary',
      'world-time',
      'holiday-query',
      'global-country-info',
      'voltage-plug-guide',
      'email-signature-generator',
    ],
  },
  {
    id: 'flow-2',
    label: '报价与核算',
    summary: '算清这单能赚多少：成本、汇率、佣金、阶梯价，一次算明白。',
    slugs: [
      'quote-calculator',
      'currency-converter',
      'import-landed-cost-calculator',
      'supplier-quote-comparison',
      'tiered-quote-calculator',
      'order-break-even-calculator',
      'discount-volume-calculator',
      'fx-sensitivity-calculator',
      'commission-calculator',
    ],
  },
  {
    id: 'flow-3',
    label: '收款与风险',
    summary: '钱能不能安全到账：选付款方式、算账期成本、做信用证与退税核对。',
    slugs: [
      'payment-risk-guide',
      'payment-terms-calculator',
      'lc-discrepancy-checklist',
      'export-tax-rebate-calculator',
      'lc-discount-calculator',
      'payment-reminder-generator',
      'remittance-cost-calculator',
    ],
  },
  {
    id: 'flow-4',
    label: '出货与物流',
    summary: '货怎么装、运费多少：装柜、计费重、货代账单、报关与保险逐项核对。',
    slugs: [
      'container-load-calculator',
      'ocean-freight-calculator',
      'air-freight-calculator',
      'express-channel-comparison',
      'pallet-load-calculator',
      'packaging-plan-comparison',
      'freight-charge-audit',
      'customs-cost-calculator',
      'cargo-insurance-calculator',
      'demurrage-detention-calculator',
      'unit-converter',
    ],
  },
  {
    id: 'flow-5',
    label: '单证与交期',
    summary: '单据别返工、交期别误判：发票、装箱单、唛头、交期一次做对。',
    slugs: ['invoice-generator', 'packing-list-generator', 'delivery-date-calculator', 'shipping-mark-generator'],
  },
  {
    id: 'flow-6',
    label: '效率小工具',
    summary: '不属于某个环节，但每天都要顺手点一下：转换、格式化、生成。',
    slugs: [
      'rmb-converter',
      'number-to-english',
      'currency-symbols',
      'text-case',
      'pinyin',
      'special-char',
      'json-formatter',
      'yaml-json-converter',
      'csv-to-markdown',
      'barcode-generator',
      'image-compressor',
      'timestamp-converter',
    ],
  },
]

/** 首页业务流里出现的全部 slug（用于覆盖率校验） */
export const HOME_FLOW_TOOL_SLUGS: readonly string[] = HOME_FLOW_STAGES.flatMap((stage) => stage.slugs)
