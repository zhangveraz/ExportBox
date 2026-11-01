// 名称: 汇率获取与降级
// 描述: 统一维护外贸常用币种的实时汇率拉取、内置参考值与来源说明
// 路径: ExportBox/lib/tools/exchange-rate.ts
// 作者: ExportBox
// 更新时间: 2026-10-30

/** 汇率快照：rates 以 CNY = 1 为基准，表示 1 元人民币可兑换的外币数量 */
export interface ExchangeRateSnapshot {
  rates: Record<string, number>
  source: 'live' | 'fallback'
  fetchedAt: string | null
  stale: boolean
}

export const RATE_BASE_CURRENCY = 'CNY'

/** 需要从接口中取用的币种（与换算器下拉保持一致） */
const TRACKED_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'HKD', 'KRW', 'AUD', 'CAD', 'SGD']

/**
 * 内置参考汇率（1 CNY 可兑换的外币数量）。
 * 仅在实时接口不可用时兜底，数值为长期中枢的近似值，用于估算而非结算。
 */
export const FALLBACK_EXCHANGE_RATES: Record<string, number> = {
  CNY: 1,
  USD: 0.1408,
  EUR: 0.129,
  GBP: 0.1115,
  JPY: 21.2,
  HKD: 1.1,
  KRW: 190,
  AUD: 0.215,
  CAD: 0.195,
  SGD: 0.189,
}

const RATE_API = 'https://open.er-api.com/v6/latest/CNY'

function buildTrackedRates(source: Record<string, number>): Record<string, number> {
  const rates: Record<string, number> = { [RATE_BASE_CURRENCY]: 1 }
  for (const code of TRACKED_CURRENCIES) {
    const value = source[code]
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      rates[code] = value
    }
  }
  return rates
}

/**
 * 拉取实时汇率。任何异常都降级为内置参考值，保证页面始终可用。
 */
export async function fetchExchangeRates(): Promise<ExchangeRateSnapshot> {
  try {
    const response = await fetch(RATE_API, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`汇率接口返回 ${response.status}`)
    }
    const payload = (await response.json()) as { result?: string; time_last_update_utc?: string; rates?: Record<string, number> }
    if (payload.result && payload.result !== 'success') {
      throw new Error('汇率接口返回失败状态')
    }
    const rates = buildTrackedRates(payload.rates ?? {})
    // 至少拿到一半币种才认为实时数据可用
    if (Object.keys(rates).length - 1 < Math.ceil(TRACKED_CURRENCIES.length / 2)) {
      throw new Error('汇率数据不完整')
    }
    return {
      rates,
      source: 'live',
      fetchedAt: payload.time_last_update_utc ?? new Date().toISOString(),
      stale: false,
    }
  } catch {
    return {
      rates: { ...FALLBACK_EXCHANGE_RATES },
      source: 'fallback',
      fetchedAt: null,
      stale: true,
    }
  }
}

/** 生成汇率来源文案，供页面展示 */
export function getExchangeRateSourceLabel(snapshot: ExchangeRateSnapshot): string {
  if (snapshot.source === 'live' && snapshot.fetchedAt) {
    const date = new Date(snapshot.fetchedAt)
    const text = Number.isNaN(date.getTime())
      ? snapshot.fetchedAt
      : date.toLocaleString('zh-CN', { hour12: false })
    return `实时中间价 · 更新于 ${text}`
  }
  return '内置参考汇率 · 实时获取失败，请手动锁定汇率'
}
