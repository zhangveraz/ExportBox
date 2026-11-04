// 名称: 使用记录器
// 描述: 每次打开工具页面就在浏览器本地记一笔，供手机端「高频入口」按真实使用次数排序
// 路径: ExportBox/components/tools/usage-recorder.tsx
// 作者: ExportBox
// 更新时间: 2026-11-03

'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { recordToolOpen } from '@/lib/tools/personalization'

export function UsageRecorder() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    // 只记工具页，形如 /tools/quote-calculator
    const match = /^\/tools\/([^/?#]+)/.exec(pathname)
    if (!match) return
    recordToolOpen(match[1])
  }, [pathname])

  return null
}
