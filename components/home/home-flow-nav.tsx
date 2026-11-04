// 名称: 首页业务流标签条
// 描述: 「按业务流选择工具」下方的小标签，点击平滑滚动到对应阶段，滚动时自动高亮当前阶段
// 路径: ExportBox/components/home/home-flow-nav.tsx
// 作者: ExportBox
// 更新时间: 2026-11-03

'use client'

import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { HOME_FLOW_STAGES } from './home-flow'

const PILL_BASE =
  'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium shadow-xs shadow-slate-900/2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
const PILL_ACTIVE =
  'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-400/50 dark:bg-blue-400/15 dark:text-blue-200'
const PILL_IDLE =
  'border-slate-200 bg-white/80 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:border-blue-400/50 dark:hover:bg-blue-400/15 dark:hover:text-blue-200'

export function HomeFlowNav() {
  const [activeId, setActiveId] = useState('')

  const syncActive = useCallback(() => {
    // 滚动到视口上方 160px 以内就算「当前阶段」，最后一个命中的就是当前看到的那段
    let current = ''
    for (const stage of HOME_FLOW_STAGES) {
      const element = document.getElementById(stage.id)
      if (!element) continue
      if (element.getBoundingClientRect().top <= 160) current = stage.id
    }
    setActiveId(current)
  }, [])

  useEffect(() => {
    // 首帧放在下一帧里算，避免在 effect 里同步 setState 触发级联渲染
    const rafId = window.requestAnimationFrame(syncActive)
    window.addEventListener('scroll', syncActive, { passive: true })
    window.addEventListener('resize', syncActive)
    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', syncActive)
      window.removeEventListener('resize', syncActive)
    }
  }, [syncActive])

  return (
    <div className="flex flex-wrap gap-2">
      {HOME_FLOW_STAGES.map((stage, index) => {
        const isActive = activeId === stage.id
        return (
          <a
            key={stage.id}
            href={`#${stage.id}`}
            aria-current={isActive ? 'true' : undefined}
            onClick={(event) => {
              event.preventDefault()
              const element = document.getElementById(stage.id)
              if (!element) return
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setActiveId(stage.id)
            }}
            className={cn(PILL_BASE, isActive ? PILL_ACTIVE : PILL_IDLE)}
          >
            <span className="text-[10px] font-semibold tabular-nums opacity-50">{String(index + 1).padStart(2, '0')}</span>
            {stage.label}
            <span className="text-[10px] tabular-nums opacity-50">{stage.slugs.length}</span>
          </a>
        )
      })}
    </div>
  )
}
