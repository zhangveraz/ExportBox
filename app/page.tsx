// 名称: 外贸工具集首页
// 描述: 组合高频入口、业务流程、工具目录、精选资源与团队说明
// 路径: ExportBox/app/page.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import { HOME_ACTIVE_CATEGORIES, HOME_TOOLS_BY_CATEGORY } from '@/components/home/home-data'
import { HomeCategoryRail } from '@/components/home/home-category-nav'
import { HomeHero } from '@/components/home/home-hero'
import { HomeResources } from '@/components/home/home-resources'
import { HomeSummary } from '@/components/home/home-summary'
import { HomeToolDirectory } from '@/components/home/home-tool-directory'

export default function HomePage() {
  // 悬浮分类栏的数据，id 必须和首页分类卡片的锚点保持一致
  const categoryItems = HOME_ACTIVE_CATEGORIES.map((category, index) => ({
    id: `category-${index}`,
    label: category,
    count: HOME_TOOLS_BY_CATEGORY[category].length,
  }))

  return (
    <>
      <div className="space-y-12">
        <HomeHero />
        <HomeToolDirectory />
        <HomeResources />
        <HomeSummary />
      </div>
      {/* 悬浮在右侧的分类导航：脱离文档流，不占正文宽度，滚动时始终可见 */}
      <HomeCategoryRail items={categoryItems} />
    </>
  )
}
