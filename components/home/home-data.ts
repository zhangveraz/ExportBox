// 名称: 首页展示数据
// 描述: 聚合首页工具图标、业务流程、统计与精选资源映射
// 路径: ExportBox/components/home/home-data.ts
// 作者: ExportBox
// 更新时间: 2026-08-11

import type { ComponentType } from 'react'
import {
  AlertCircle,
  ArrowLeftRight,
  BadgePercent,
  BellRing,
  BookMarked,
  Bot,
  Boxes,
  Calendar,
  CalendarClock,
  Calculator,
  CircleDollarSign,
  Clock,
  Code,
  Code2,
  Container,
  CreditCard,
  Database,
  FileCheck2,
  FileText,
  FileJson,
  FileSearch,
  Fingerprint,
  Factory,
  GitCompareArrows,
  Globe,
  HandCoins,
  Hash,
  ImageDown,
  IdCard,
  Languages,
  Landmark,
  ListOrdered,
  MailCheck,
  ClipboardCheck,
  Tag,
  Umbrella,
  MessageSquare,
  Network,
  Package,
  Percent,
  Plane,
  ReceiptText,
  Ruler,
  ScanBarcode,
  Server,
  ShieldCheck,
  Ship,
  TrendingUp,
  Type,
  Zap,
Gauge,
Wallet,
  Layers3,
} from 'lucide-react'
import { PARTNER_RESOURCES, type PartnerResourceType } from '@/lib/partner-resources'
import { COUNTRY_DATA } from '@/lib/tools/global-country-info'
import { TOOL_REGISTRY, getActiveCategories, getToolsByCategory } from '@/lib/tools/registry'
import { TOOL_UI_CONFIG, getToolBadgeClassName } from '@/lib/tools/registry-ui'

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  AlertCircle,
  ArrowLeftRight,
  BadgePercent,
  BellRing,
  BookMarked,
  Boxes,
  Calculator,
  Calendar,
  CalendarClock,
  CircleDollarSign,
  Clock,
  Code2,
  Container,
  Factory,
  FileCheck2,
  FileText,
  FileJson,
  FileSearch,
  Gauge,
  GitCompareArrows,
  Globe,
  HandCoins,
  Hash,
  ImageDown,
  IdCard,
  Landmark,
  Languages,
  Layers3,
  ListOrdered,
  MailCheck,
  ClipboardCheck,
  Tag,
  Umbrella,
  Package,
  Percent,
  Plane,
  ReceiptText,
  Ruler,
  ScanBarcode,
  Server,
  ShieldCheck,
  Ship,
  TrendingUp,
  Type,
  Wallet,
  Zap,
}

export const HOME_TOOLS = TOOL_REGISTRY.map((tool) => {
  const uiConfig = TOOL_UI_CONFIG[tool.id] || {
    color: 'text-slate-500',
    bgColor: 'bg-slate-50',
  }

  return {
    ...tool,
    icon: ICON_MAP[tool.iconName] || Code,
    badgeClassName: getToolBadgeClassName(tool.badge),
    ...uiConfig,
  }
})

export const HOME_TOOLS_BY_CATEGORY = getToolsByCategory()
export const HOME_ACTIVE_CATEGORIES = getActiveCategories()

// 首页「常用」入口：12 个，桌面端正好两排 × 6 列
// 第一排＝报价与成本，第二排＝出货与资料，按业务先后排列
const heroToolIds = [
  'quote-calculator',
  'import-landed-cost-calculator',
  'currency-converter',
  'ocean-freight-calculator',
  'air-freight-calculator',
  'express-channel-comparison',
  'container-load-calculator',
  'shipping-mark-generator',
  'packing-list-generator',
  'unit-converter',
  'holiday-query',
  'email-phrase-library',
]

export const HERO_TOOLS = heroToolIds
  .map((id) => HOME_TOOLS.find((tool) => tool.id === id))
  .filter((tool): tool is (typeof HOME_TOOLS)[number] => Boolean(tool))

export const HOME_STATS = [
  { label: '工具总数', value: `${HOME_TOOLS.length}`, icon: Zap },
  { label: '业务场景', value: `${HOME_ACTIVE_CATEGORIES.length}`, icon: ShieldCheck },
  { label: '国家与地区资料', value: `${COUNTRY_DATA.length}`, icon: Globe },
  { label: '持续优化', value: 'Live', icon: TrendingUp },
]

export const PARTNER_TYPE_META: Record<PartnerResourceType, { icon: ComponentType<{ className?: string }>; tone: string }> = {
  '客户开发': { icon: MailCheck, tone: 'text-emerald-600 dark:text-emerald-300' },
  '代理网络': { icon: Network, tone: 'text-cyan-600 dark:text-cyan-300' },
  '浏览器环境': { icon: Fingerprint, tone: 'text-violet-600 dark:text-violet-300' },
  '企业数据': { icon: Database, tone: 'text-amber-600 dark:text-amber-300' },
  '主机与建站': { icon: Server, tone: 'text-indigo-600 dark:text-indigo-300' },
  '域名服务': { icon: Globe, tone: 'text-blue-600 dark:text-blue-300' },
  '账号与支付': { icon: CreditCard, tone: 'text-sky-600 dark:text-sky-300' },
  'AI 工具': { icon: Bot, tone: 'text-fuchsia-600 dark:text-fuchsia-300' },
  '验证服务': { icon: MessageSquare, tone: 'text-orange-600 dark:text-orange-300' },
}

const featuredPartnerResourceIds = [
  'laifaxin',
  'talordata',
  'usappid',
  'xiaohuojian',
  'gpt-mj',
  'bitgetwallet',
  'dmit',
  'namesilo',
]

export const FEATURED_PARTNER_RESOURCES = featuredPartnerResourceIds
  .map((id) => PARTNER_RESOURCES.find((resource) => resource.id === id))
  .filter((resource): resource is (typeof PARTNER_RESOURCES)[number] => Boolean(resource))
