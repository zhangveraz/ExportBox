// 名称: 外贸工具集首页
// 描述: 组合高频入口、业务流程、工具目录、精选资源与页尾说明卡
// 路径: ExportBox/app/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-03

import { HomeClosingCards } from '@/components/home/home-closing-cards'
import { HomeHero } from '@/components/home/home-hero'
import { HomeResources } from '@/components/home/home-resources'
import { HomeToolDirectory } from '@/components/home/home-tool-directory'

export default function HomePage() {
  return (
    <div className="space-y-12">
      <HomeHero />
      <HomeToolDirectory />
      <HomeResources />
      <HomeClosingCards />
    </div>
  )
}
