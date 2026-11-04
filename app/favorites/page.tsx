// 名称: 收藏夹页面
// 描述: 集中展示用户收藏的外贸工具，可一键打开或取消收藏
// 路径: ExportBox/app/favorites/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-03

import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/site'
import { FavoritesView } from './favorites-view'

export const metadata: Metadata = {
  title: `我的收藏夹 | ${SITE_NAME}`,
  description: '你收藏的外贸工具都在这里，点开即用；收藏只保存在你自己的浏览器里。',
  // 收藏夹内容因人而异，不参与搜索引擎索引
  robots: { index: false, follow: true },
}

export default function FavoritesPage() {
  return <FavoritesView />
}
