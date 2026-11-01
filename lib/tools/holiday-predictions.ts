// 名称: 节假日预测数据生成
// 描述: 用 2026 / 2027 的官方数据反推「固定日期 / 第几个星期几 / 复活节偏移」三类规则，
//       再用规则推算出 2028 及以后的可预测节日。农历、伊斯兰历等无法用公历规则推算的节日会被跳过。
// 路径: ExportBox/lib/tools/holiday-predictions.ts
// 作者: ExportBox
// 更新时间: 2026-11-01

import { generatedHolidays2026, generatedHolidays2027 } from './holiday-query-generated'

interface HolidayLike {
  date: string
  name: string
  localName?: string
  nameCN?: string
  type: 'public' | 'regional' | 'observance' | 'international'
  impact: 'high' | 'medium' | 'low'
  description?: string
}

type Rule =
  | { kind: 'fixed'; month: number; day: number }
  | { kind: 'nthWeekday'; month: number; weekday: number; ordinal: number }
  | { kind: 'easterOffset'; offset: number }
  | { kind: 'lunar'; month: number; day: number }
  | { kind: 'unknown' }

const BASE_YEAR_A = 2026
const BASE_YEAR_B = 2027

/** 复活节星期天（Meeus/Jones/Butcher 算法），返回当月零基月份与日 */
function easterSunday(year: number): { month: number; day: number } {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return { month, day }
}

/** 把日期换算成「距离当年复活节多少天」，跨年时按闰年正常增减 */
function dayOfYear(year: number, month: number, day: number): number {
  return Math.round((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86400000)
}

function easterOffset(year: number, month: number, day: number): number {
  const easter = easterSunday(year)
  return dayOfYear(year, month, day) - dayOfYear(year, easter.month, easter.day)
}

/** 某年某月第 n 个星期几是几号（n 超出时取最后一个） */
function nthWeekdayOfMonth(year: number, month: number, weekday: number, ordinal: number): number {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
  const firstMatch = 1 + ((weekday - firstWeekday + 7) % 7)
  const day = firstMatch + (ordinal - 1) * 7
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return day <= daysInMonth ? day : day - 7
}

function shiftDate(year: number, month: number, day: number, offset: number): string {
  const base = new Date(Date.UTC(year, month - 1, day))
  base.setUTCDate(base.getUTCDate() + offset)
  return base.toISOString().slice(0, 10)
}

function parseDate(value: string): { year: number; month: number; day: number } {
  const [year, month, day] = value.split('-').map(Number)
  return { year, month, day }
}

const baseA = generatedHolidays2026 as unknown as Record<string, HolidayLike[]>
const baseB = generatedHolidays2027 as unknown as Record<string, HolidayLike[]>

/** 根据两个基准年份的数据推断某条节日遵循哪种规则 */
function inferRule(name: string, a: HolidayLike | undefined, b: HolidayLike | undefined): Rule {
  if (!a || !b) return { kind: 'unknown' }
  const dateA = parseDate(a.date)
  const dateB = parseDate(b.date)

  // 1) 每年同月同日 → 固定日期
  if (dateA.month === dateB.month && dateA.day === dateB.day) {
    return { kind: 'fixed', month: dateA.month, day: dateA.day }
  }

  // 2) 农历节日（春节、中秋、端午等）→ 按农历月日换算
  const lunar = matchLunarRule(name)
  if (lunar) {
    return { kind: 'lunar', month: lunar.month, day: lunar.day }
  }

  // 2) 与复活节的间隔相同 → 复活节相关（耶稣受难日、圣灵降临节等）
  const offsetA = easterOffset(dateA.year, dateA.month, dateA.day)
  const offsetB = easterOffset(dateB.year, dateB.month, dateB.day)
  if (offsetA === offsetB) {
    return { kind: 'easterOffset', offset: offsetA }
  }

  // 3) 同月、同星期几、同「第几个」 → 例如 5 月最后一个星期一
  const weekdayA = new Date(Date.UTC(dateA.year, dateA.month - 1, dateA.day)).getUTCDay()
  const weekdayB = new Date(Date.UTC(dateB.year, dateB.month - 1, dateB.day)).getUTCDay()
  const ordinalA = Math.ceil(dateA.day / 7)
  const ordinalB = Math.ceil(dateB.day / 7)
  if (dateA.month === dateB.month && weekdayA === weekdayB && ordinalA === ordinalB) {
    return { kind: 'nthWeekday', month: dateA.month, weekday: weekdayA, ordinal: ordinalA }
  }

  // 4) 农历 / 伊斯兰历 / 希伯来历等：公历上没有稳定规律，预测年份直接跳过
  return { kind: 'unknown' }
}

const ruleCache = new Map<string, Rule>()

/**
 * 农历节日规则：农历日期每年都变，用公历规则算不出来，
 * 这里借助浏览器/Node 内置的中国农历历法（Intl 的 chinese calendar）换算。
 */
const LUNAR_RULES: Array<{ pattern: RegExp; month: number; day: number }> = [
  { pattern: /chinese new year|spring festival|lunar new year|\btet\b/i, month: 1, day: 1 },
  { pattern: /second day of lunar new year/i, month: 1, day: 2 },
  { pattern: /third day of lunar new year/i, month: 1, day: 3 },
  { pattern: /dragon boat/i, month: 5, day: 5 },
  { pattern: /day following the mid-autumn/i, month: 8, day: 16 },
  { pattern: /mid-autumn|chuseok/i, month: 8, day: 15 },
  { pattern: /chung yeung/i, month: 9, day: 9 },
  { pattern: /buddha'?s birthday|vesak/i, month: 4, day: 8 },
]

const lunarCalendarFormatter = new Intl.DateTimeFormat('en-u-ca-chinese', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
})

const lunarYearCache = new Map<number, Map<string, string>>()

/** 建立「农历月/日 → 公历日期」对照表，按年份缓存 */
function getLunarLookup(year: number): Map<string, string> {
  const cached = lunarYearCache.get(year)
  if (cached) return cached

  const lookup = new Map<string, string>()
  const cursor = new Date(Date.UTC(year, 0, 1))
  while (cursor.getUTCFullYear() === year) {
    // 输出形如 "12/5/2027"：农历月/日/农历年
    const [lunarMonth, lunarDay, lunarYear] = lunarCalendarFormatter.format(cursor).split('/')
    const key = `${Number(lunarYear)}-${Number(lunarMonth)}-${Number(lunarDay)}`
    if (!lookup.has(key)) lookup.set(key, cursor.toISOString().slice(0, 10))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  lunarYearCache.set(year, lookup)
  return lookup
}

function matchLunarRule(name: string) {
  return LUNAR_RULES.find((rule) => rule.pattern.test(name))
}

function resolveLunarDate(year: number, month: number, day: number): string | null {
  return getLunarLookup(year).get(`${year}-${month}-${day}`) ?? null
}

function getRule(countryCode: string, holiday: HolidayLike): Rule {
  const key = `${countryCode}::${holiday.name}`
  const cached = ruleCache.get(key)
  if (cached) return cached
  const matches = baseB[countryCode]?.filter((item) => item.name === holiday.name) ?? []
  const rule = inferRule(holiday.name, holiday, matches[0])
  ruleCache.set(key, rule)
  return rule
}

function resolveDate(rule: Rule, year: number, occurrenceOffset: number): string | null {
  if (rule.kind === 'fixed') {
    return `${year}-${String(rule.month).padStart(2, '0')}-${String(rule.day).padStart(2, '0')}`
  }
  if (rule.kind === 'nthWeekday') {
    const day = nthWeekdayOfMonth(year, rule.month, rule.weekday, rule.ordinal)
    return `${year}-${String(rule.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
  if (rule.kind === 'easterOffset') {
    const easter = easterSunday(year)
    return shiftDate(year, easter.month, easter.day, rule.offset)
  }
  if (rule.kind === 'lunar') {
    const base = resolveLunarDate(year, rule.month, rule.day)
    if (!base) return null
    // 连休多天的节日（如春节三天、秋夕三天）按同名列的顺序顺延
    const [y, m, d] = base.split('-').map(Number)
    return shiftDate(y, m, d, occurrenceOffset)
  }
  return null
}

/** 生成某个预测年份的各国节日数据 */
export function buildPredictedHolidays(year: number): Record<string, HolidayLike[]> {
  const result: Record<string, HolidayLike[]> = {}

  Object.entries(baseA).forEach(([countryCode, holidays]) => {
    const predicted: HolidayLike[] = []
    const nameCount = new Map<string, number>()
    holidays.forEach((holiday) => {
      const occurrenceOffset = nameCount.get(holiday.name) ?? 0
      nameCount.set(holiday.name, occurrenceOffset + 1)
      const rule = getRule(countryCode, holiday)
      const date = resolveDate(rule, year, occurrenceOffset)
      if (!date) return
      predicted.push({
        ...holiday,
        date,
        description: holiday.description ? `${holiday.description}（预测日期，以官方公告为准）` : '预测日期，以当年官方公告为准',
      })
    })

    const seen = new Set<string>()
    result[countryCode] = predicted
      .sort((x, y) => x.date.localeCompare(y.date) || x.name.localeCompare(y.name))
      .filter((item) => {
        const key = `${item.date}::${item.name}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
  })

  return result
}

export const PREDICTION_BASE_YEARS = [BASE_YEAR_A, BASE_YEAR_B] as const
