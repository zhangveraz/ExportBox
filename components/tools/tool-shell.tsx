// 名称: 工具页紧凑外壳
// 描述: 统一的一屏式外壳：紧凑标题栏 + 重置按钮 + 固定整页缩放
// 路径: ExportBox/components/tools/tool-shell.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

'use client'

import type { ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'
import { ToolTitleFavorite } from './tool-title-favorite'

/**
 * 全站统一显示密度：字号调整已下线，一律按最大档（1.12）显示。
 * 需要特殊密度的页面（如装箱单打印预览）用 fixedZoom 覆盖。
 */
export const DEFAULT_TOOL_ZOOM = 1.12

/**
 * 大屏（2K 及以上，CSS 宽度 ≥ 2200px）时的自动放大比例。
 * 2K 屏在 100% 缩放下 1px 只有一个物理像素，10–11px 的说明文字会偏小，
 * 所以宽屏时整体再放大一档；1080p 完全不受影响。见 app/globals.css。
 */
export const WIDE_SCREEN_TOOL_ZOOM = 1.25

/**
 * 结果列吸附容器。各工具页的双栏比例按业务特点单独定义，
 * 这里只统一「滚动时结果跟着走」的行为。
 */
export const TOOL_RESULT_COLUMN = 'space-y-3 xl:sticky xl:top-20'

interface ToolShellProps {
  title: string
  description: string
  /** 传了才显示重置按钮 */
  onReset?: () => void
  /** @deprecated 字号切换已下线，保留该属性只为兼容旧调用 */
  hideZoom?: boolean
  /** 覆盖默认缩放比例（默认 1.12） */
  fixedZoom?: number
  children: ReactNode
}

export function ToolShell({ title, description, onReset, fixedZoom, children }: ToolShellProps) {
  const zoom = fixedZoom ?? DEFAULT_TOOL_ZOOM

  return (
    <div style={{ zoom }} data-tool-shell data-fixed-zoom={fixedZoom ? 'true' : undefined}>
      {/* 标题栏：一行放下标题、说明与重置（打印时隐藏） */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground" title={description}>
            {description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ToolTitleFavorite />
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 px-2.5 text-xs text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-white/15 dark:text-slate-300 dark:hover:border-blue-300/40 dark:hover:bg-blue-400/10"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              重置
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
