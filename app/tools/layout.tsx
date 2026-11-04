// 名称: 工具页统一布局
// 描述: 工具页公共骨架：内容 + 相关工具 + 底部功能分类标签条
// 路径: ExportBox/app/tools/layout.tsx
// 作者: ExportBox
// 更新时间: 2026-11-03

import { RelatedTools } from '@/components/tools/related-tools'
import { ToolCategoryNav } from '@/components/tools/tool-category-nav'
import { getActiveCategories, getToolsByCategory, TOOL_REGISTRY } from '@/lib/tools/registry'

/** 功能分类（不是首页的业务流分类）→ 工具目录页对应锚点 */
const CATEGORY_LINKS = (() => {
  const grouped = getToolsByCategory()
  return getActiveCategories().map((category, index) => ({
    label: category,
    href: `/tools#category-${index}`,
    count: grouped[category].length,
  }))
})()

/** slug → 功能分类，用于高亮当前工具所属分类 */
const CATEGORY_BY_SLUG = TOOL_REGISTRY.reduce<Record<string, string>>((map, tool) => {
  map[tool.slug] = tool.category
  return map
}, {})

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-[1440px]">
      {children}
      <RelatedTools />
      <ToolCategoryNav categories={CATEGORY_LINKS} categoryBySlug={CATEGORY_BY_SLUG} />
    </section>
  )
}
