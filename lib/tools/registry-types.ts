// 名称: 工具注册表类型
// 描述: 定义工具分类、元数据字段与固定分类顺序
// 路径: ExportBox/lib/tools/registry-types.ts
// 作者: ExportBox
// 更新时间: 2026-07-15

export const TOOL_CATEGORIES = [
  '财务报价',
  '物流与装柜',
  '外贸沟通',
  '时间与节假日',
  '国家与货币',
  '文本处理',
  '文件与格式转换',
] as const

export type ToolCategory = (typeof TOOL_CATEGORIES)[number]

export interface ToolMeta {
  id: string
  slug: string
  title: string
  shortTitle: string
  description: string
  category: ToolCategory
  iconName: string
  href: string
  updatedAt: string
  badge?: string
  keywords?: string[]
  seoTitle?: string
  seoDescription?: string
  useCases?: string[]
  relatedTools?: string[]
}
