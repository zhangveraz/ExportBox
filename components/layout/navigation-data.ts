// 名称: 导航展示数据
// 描述: 维护导航分类、精选工具、新工具与外部入口映射
// 路径: ExportBox/components/layout/navigation-data.ts
// 作者: ExportBox
// 更新时间: 2026-10-30

import type { ComponentType } from 'react'
import {
  CalendarDays,
  CircleDollarSign,
  FileCode2,
  Globe2,
  MessageSquareText,
  PackageCheck,
  Ship,
} from 'lucide-react'
import { TOOL_REGISTRY, type ToolCategory, type ToolMeta, getActiveCategories, getToolsByCategory } from '@/lib/tools/registry'

export const NAV_TOOLS_BY_CATEGORY = getToolsByCategory()
export const NAV_ACTIVE_CATEGORIES = getActiveCategories()

export const NAV_CATEGORY_META: Record<ToolCategory, { icon: ComponentType<{ className?: string }>; tone: string }> = {
  '财务报价': { icon: CircleDollarSign, tone: 'text-emerald-600 dark:text-emerald-300' },
  '文本处理': { icon: MessageSquareText, tone: 'text-sky-600 dark:text-sky-300' },
  '时间与节假日': { icon: CalendarDays, tone: 'text-amber-600 dark:text-amber-300' },
  '国家与货币': { icon: Globe2, tone: 'text-cyan-600 dark:text-cyan-300' },
  '物流与装柜': { icon: Ship, tone: 'text-lime-600 dark:text-lime-300' },
  '外贸沟通': { icon: PackageCheck, tone: 'text-teal-600 dark:text-teal-300' },
  '文件与格式转换': { icon: FileCode2, tone: 'text-orange-600 dark:text-orange-300' },
}

const featuredToolIds = [
  'quote-calculator',
  'import-landed-cost-calculator',
  'container-load-calculator',
  'air-freight-calculator',
  'express-channel-comparison',
]

export const NAV_FEATURED_TOOLS = featuredToolIds
  .map((id) => TOOL_REGISTRY.find((tool) => tool.id === id))
  .filter((tool): tool is ToolMeta => Boolean(tool))

/** 页眉快捷入口用的更短称呼（留空则沿用工具的 shortTitle） */
const HEADER_SHORT_TITLE_OVERRIDE: Record<string, string> = {
  'air-freight-calculator': '空运计重费',
}

/** 页眉快捷入口：按「报价利润 → 到岸成本 → 装柜计算 → 空运计重费 → 快递专线比价」的业务顺序排列 */
export const NAV_HEADER_TOOLS = NAV_FEATURED_TOOLS.map((tool) => ({
  ...tool,
  shortTitle: HEADER_SHORT_TITLE_OVERRIDE[tool.id] ?? tool.shortTitle,
}))

/**
 * 手机端「高频入口」的兜底清单（前 8 个）
 * 与首页「常用工具」区（components/home/home-data.ts 的 HERO_TOOLS）前 8 个保持一致；
 * 新用户本机还没有使用记录时，就按这个顺序展示
 */
export const NAV_FALLBACK_FREQUENT_TOOLS = [
  'quote-calculator',
  'import-landed-cost-calculator',
  'currency-converter',
  'ocean-freight-calculator',
  'air-freight-calculator',
  'express-channel-comparison',
  'container-load-calculator',
  'shipping-mark-generator',
]

export const NAV_EXTERNAL_LINKS: { href: string; label: string; icon: ComponentType<{ className?: string }> }[] = []
