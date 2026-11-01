// 名称: 首页分类导航（标签条 / 右侧悬浮竖条）
// 描述: 点击标签平滑滚动到首页对应分类工具区；右侧竖条可上下拖动、悬停展开、自动高亮当前分类
// 路径: ExportBox/components/home/home-category-nav.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Calculator,
  CalendarClock,
  Container,
  Files,
  Globe2,
  ListTree,
  MessagesSquare,
  Type,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/** 每个分类对应的小图标，收起状态只看图标也能大致认出来 */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  财务报价: Calculator,
  物流与装柜: Container,
  外贸沟通: MessagesSquare,
  时间与节假日: CalendarClock,
  国家与货币: Globe2,
  文本处理: Type,
  文件与格式转换: Files,
}

const RAIL_STORAGE_KEY = 'exportbox-category-rail'
const DRAG_THRESHOLD = 4
/** 竖条顶端最小离屏幕顶部距离，别被页眉压住 */
const MIN_TOP = 96
const BOTTOM_GAP = 20

export interface CategoryNavItem {
  /** 对应分类卡片上的 id */
  id: string
  label: string
  count: number
}

interface CategoryNavProps {
  items: CategoryNavItem[]
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** 监听滚动，返回当前停留在视口上方区域的分类 id */
function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null)
  // 用字符串做依赖，避免数组每次渲染都是新引用导致重复绑定监听
  const key = ids.join('|')

  useEffect(() => {
    const sections = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length === 0) return
        const topMost = visible.reduce((prev, current) =>
          current.boundingClientRect.top < prev.boundingClientRect.top ? current : prev,
        )
        setActiveId(topMost.target.id)
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [key])

  return [activeId, setActiveId] as const
}

/** 横向标签条：位于「按业务流选择工具」标题下方 */
export function HomeCategoryChips({ items }: CategoryNavProps) {
  const ids = useMemo(() => items.map((item) => item.id), [items])
  const [activeId, setActiveId] = useActiveSection(ids)
  const [atTop, setAtTop] = useState(true)

  // 靠近顶部时点亮「首页」标签
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 120)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const pillBase =
    'rounded-md border px-3 py-1.5 text-xs font-medium shadow-xs shadow-slate-900/2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500'
  const pillActive =
    'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-cyan-300/50 dark:bg-cyan-300/10 dark:text-cyan-200'
  const pillIdle =
    'border-slate-200 bg-white/80 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:border-cyan-300/50 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200'

  return (
    <div className="flex flex-wrap gap-2">
      {/* 回到顶部入口 */}
      <a
        href="#top"
        onClick={(event) => {
          event.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        aria-current={atTop ? 'true' : undefined}
        className={`${pillBase} ${atTop ? pillActive : pillIdle}`}
      >
        首页
      </a>
      {items.map((item) => {
        const isActive = !atTop && activeId === item.id
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(event) => {
              event.preventDefault()
              scrollToSection(item.id)
              setActiveId(item.id)
            }}
            aria-current={isActive ? 'true' : undefined}
            className={`${pillBase} ${isActive ? pillActive : pillIdle}`}
          >
            {item.label} · {item.count}
          </a>
        )
      })}
    </div>
  )
}

/**
 * 右侧悬浮竖条：
 * - 平时收成 48px 窄条（竖排「工具分类」+ 图标），鼠标移上去向左展开完整列表
 * - 可上下拖动，位置记在浏览器里，下次打开还在原处
 */
export function HomeCategoryRail({ items }: CategoryNavProps) {
  const ids = useMemo(() => items.map((item) => item.id), [items])
  const [activeId, setActiveId] = useActiveSection(ids)

  const [mounted, setMounted] = useState(false)
  const [top, setTop] = useState(0)
  // pressing：手指/鼠标按下但还没真正拖动；dragging：已经拖起来了
  // 分开两个状态，是为了按下时先不要收起展开面板，否则一按面板就消失、点击就失效
  const [pressing, setPressing] = useState(false)
  const [dragging, setDragging] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const topRef = useRef(0)
  const movedRef = useRef(false)
  const dragRef = useRef({ startY: 0, originTop: 0 })

  /** 竖条最高能拖到哪：留出底部空隙，保证整块都在屏幕内 */
  const maxTop = useCallback(() => {
    const height = navRef.current?.offsetHeight ?? 320
    return Math.max(MIN_TOP, window.innerHeight - height - BOTTOM_GAP)
  }, [])

  const applyTop = useCallback((next: number) => {
    const value = clamp(next, MIN_TOP, maxTop())
    topRef.current = value
    setTop(value)
  }, [maxTop])

  const persistTop = useCallback((value: number) => {
    try {
      const range = Math.max(1, maxTop() - MIN_TOP)
      window.localStorage.setItem(
        RAIL_STORAGE_KEY,
        JSON.stringify({ ratio: clamp((value - MIN_TOP) / range, 0, 1) }),
      )
    } catch {
      // 浏览器禁用存储时忽略
    }
  }, [maxTop])

  // 初始位置：优先用上次记住的相对位置，没有则垂直居中
  useEffect(() => {
    const height = navRef.current?.offsetHeight ?? 320
    const centered = Math.max(MIN_TOP, (window.innerHeight - height) / 2)
    let stored: number | null = null
    try {
      const raw = window.localStorage.getItem(RAIL_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { ratio?: number }
        if (typeof parsed.ratio === 'number' && Number.isFinite(parsed.ratio)) {
          stored = clamp(parsed.ratio, 0, 1)
        }
      }
    } catch {
      stored = null
    }

    const next = stored === null ? centered : MIN_TOP + stored * Math.max(0, maxTop() - MIN_TOP)
    topRef.current = clamp(next, MIN_TOP, maxTop())
    setTop(topRef.current)
    setMounted(true)
  }, [maxTop])

  // 窗口尺寸变化时，把竖条重新夹回可视范围内
  useEffect(() => {
    const onResize = () => applyTop(topRef.current)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [applyTop])

  // 拖动：用 window 上的监听器，避免指针捕获把点击事件吃掉
  useEffect(() => {
    if (!pressing) return

    const onMove = (event: PointerEvent) => {
      const delta = event.clientY - dragRef.current.startY
      if (!movedRef.current && Math.abs(delta) > DRAG_THRESHOLD) {
        movedRef.current = true
        setDragging(true)
      }
      if (movedRef.current) {
        applyTop(dragRef.current.originTop + delta)
      }
    }

    const onUp = () => {
      setPressing(false)
      setDragging(false)
      if (movedRef.current) persistTop(topRef.current)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [pressing, applyTop, persistTop])

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    // 只响应鼠标左键/触摸
    if (event.button !== 0) return
    dragRef.current = { startY: event.clientY, originTop: topRef.current }
    movedRef.current = false
    setPressing(true)
  }

  const handleJump = (event: React.MouseEvent, id: string) => {
    event.preventDefault()
    // 刚刚是在拖动，就不要顺带触发跳转
    if (movedRef.current) return
    scrollToSection(id)
    setActiveId(id)
  }

  const renderRow = (item: CategoryNavItem, withLabel: boolean) => {
    const isActive = activeId === item.id
    const Icon = CATEGORY_ICONS[item.label] ?? ListTree
    return (
      <li key={withLabel ? `${item.id}-expanded` : item.id}>
        <a
          href={`#${item.id}`}
          onClick={(event) => handleJump(event, item.id)}
          aria-current={isActive ? 'true' : undefined}
          title={withLabel ? undefined : item.label}
          className={`flex items-center gap-2 rounded-md px-1.5 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
            isActive
              ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-cyan-300/10 dark:text-cyan-200'
              : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
          }`}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
              isActive
                ? 'bg-emerald-100 text-emerald-600 dark:bg-cyan-300/15 dark:text-cyan-200'
                : 'bg-slate-100/80 text-slate-500 dark:bg-white/5 dark:text-slate-400'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          {withLabel && (
            <>
              <span className="truncate whitespace-nowrap">{item.label}</span>
              <span className="ml-auto shrink-0 text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
                {item.count}
              </span>
            </>
          )}
        </a>
      </li>
    )
  }

  if (!mounted) {
    // 先渲染但透明，等位置算好再显示，避免从错误位置跳一下
    return (
      <nav ref={navRef} aria-hidden className="pointer-events-none fixed right-3 z-40 hidden opacity-0 xl:block">
        <div className="w-12 rounded-xl border border-white/70 bg-white/85 p-2">
          <div className="flex items-center px-1.5 pb-0.5">
            <span className="flex h-6 w-6 items-center justify-center text-[11px] font-semibold text-slate-400">
              工
            </span>
          </div>
          <ul className="space-y-0.5">{items.map((item) => renderRow(item, false))}</ul>
        </div>
      </nav>
    )
  }

  // 挂到 body 上，避免被页脚（同样是 z-10 的层）盖住
  return createPortal(
    <nav
      ref={navRef}
      aria-label="工具分类导航"
      style={{ top: `${top}px` }}
      className={`fixed right-3 z-40 hidden xl:block ${dragging ? '' : 'group'}`}
    >
      {/* 收起态：常驻窄条，可上下拖动 */}
      <div
        onPointerDown={onPointerDown}
        className={`w-12 rounded-xl border border-white/70 bg-white/85 p-2 shadow-xl shadow-slate-900/8 backdrop-blur-xl select-none dark:border-white/10 dark:bg-slate-950/85 dark:shadow-black/40 ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* 顶部一个「工」字：用和图标完全相同的盒子尺寸与内边距，保证竖向对齐 */}
        <div className="flex items-center px-1.5 pb-0.5">
          <span className="flex h-6 w-6 items-center justify-center text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            工
          </span>
        </div>
        <ul className="space-y-0.5">{items.map((item) => renderRow(item, false))}</ul>
      </div>

      {/* 展开态：绝对定位在左侧，只做位移+淡入，不改变尺寸，所以不会抖动 */}
      <div className="pointer-events-none absolute top-0 right-full pr-2 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        <div className="w-[184px] rounded-xl border border-white/70 bg-white/90 p-2 shadow-xl shadow-slate-900/8 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90 dark:shadow-black/40">
          <p className="px-1.5 pb-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
            工具分类
          </p>
          <ul className="space-y-0.5">{items.map((item) => renderRow(item, true))}</ul>
        </div>
      </div>
    </nav>,
    document.body,
  )
}
