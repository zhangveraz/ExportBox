// 名称: 全站搜索悬浮球
// 描述: 可拖拽的悬浮搜索入口，可隐藏/恢复，松手自动吸附到左右边缘并记住位置
// 路径: ExportBox/components/layout/search-fab.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Search, X } from 'lucide-react'
import { SiteSearchPanel } from '@/components/search/site-search'

const FAB_SIZE = 48
const TAB_SIZE = 30
const EDGE_GAP = 20
const DRAG_THRESHOLD = 5
// 存储键保持不变，之前记住的位置依然有效
const STORAGE_KEY = 'exportbox-search-fab'
const HIDDEN_KEY = 'exportbox-search-fab-hidden'

type Side = 'left' | 'right'

interface Position {
  x: number
  y: number
}

interface StoredState {
  side: Side
  /** 纵向位置比例：0 = 贴着顶边，1 = 贴着底边 */
  yRatio: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/** 纵向可移动范围（扣除上下留白） */
function trackY() {
  return Math.max(1, window.innerHeight - FAB_SIZE - EDGE_GAP * 2)
}

function edgeX(side: Side) {
  return side === 'left' ? EDGE_GAP : Math.max(EDGE_GAP, window.innerWidth - FAB_SIZE - EDGE_GAP)
}

function readStored(): StoredState {
  if (typeof window === 'undefined') return { side: 'left', yRatio: 1 }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { side: 'left', yRatio: 1 }
    const parsed = JSON.parse(raw) as Partial<StoredState>
    const side: Side = parsed.side === 'right' ? 'right' : 'left'
    const ratio =
      typeof parsed.yRatio === 'number' && Number.isFinite(parsed.yRatio)
        ? clamp(parsed.yRatio, 0, 1)
        : 1
    return { side, yRatio: ratio }
  } catch {
    return { side: 'left', yRatio: 1 }
  }
}

function writeStored(side: Side, y: number) {
  try {
    const ratio = clamp((y - EDGE_GAP) / trackY(), 0, 1)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ side, yRatio: ratio }))
  } catch {
    // 浏览器禁用存储时忽略，不影响功能
  }
}

function readHidden() {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(HIDDEN_KEY) === '1'
  } catch {
    return false
  }
}

export function SearchFab() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<Position | null>(null)
  // 初始值直接在“第一次渲染”时读一次：服务端读到默认值，客户端读到上次记住的值。
  // 因为 position 为空时组件不渲染任何东西，所以不会出现水合不一致。
  const [side, setSide] = useState<Side>(() => readStored().side)
  const [dragging, setDragging] = useState(false)
  // 用户主动关掉搜索球后，只留一个很小的“恢复”小块，随时可以点回来
  const [hidden, setHidden] = useState(readHidden)

  const buttonRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef<Position | null>(null)
  const sideRef = useRef<Side>('left')
  const dragState = useRef({ startX: 0, startY: 0, originX: 0, originY: 0, moved: false })
  const draggingRef = useRef(false)

  const maxX = () => Math.max(0, window.innerWidth - FAB_SIZE)
  const maxY = () => Math.max(0, window.innerHeight - FAB_SIZE)

  const applyPosition = useCallback((next: Position) => {
    positionRef.current = next
    setPosition(next)
  }, [])

  // 挂载后把球放到上次记住的位置
  // 注意：position 只有这个 effect 跑完才有值，所以它本身就是“是否已就绪”的信号。
  // 放到下一帧再算，一是不用同步读布局，二是避免在 effect 里同步改 state。
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const stored = readStored()
      sideRef.current = stored.side
      applyPosition({
        x: edgeX(stored.side),
        y: EDGE_GAP + stored.yRatio * trackY(),
      })
    })
    return () => cancelAnimationFrame(id)
  }, [applyPosition])

  // 窗口尺寸变化时保持贴边，避免球跑到屏幕外
  useEffect(() => {
    const onResize = () => {
      const current = positionRef.current
      if (!current) return
      applyPosition({
        x: edgeX(sideRef.current),
        y: clamp(current.y, EDGE_GAP, Math.max(EDGE_GAP, maxY() - EDGE_GAP)),
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [applyPosition])

  const setHiddenPersisted = (next: boolean) => {
    setHidden(next)
    try {
      if (next) window.localStorage.setItem(HIDDEN_KEY, '1')
      else window.localStorage.removeItem(HIDDEN_KEY)
    } catch {
      // 忽略存储失败
    }
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = positionRef.current
    if (!current) return
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: current.x,
      originY: current.y,
      moved: false,
    }
    setDragging(true)
    draggingRef.current = true
    buttonRef.current?.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    const state = dragState.current
    const deltaX = event.clientX - state.startX
    const deltaY = event.clientY - state.startY

    if (!state.moved && (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD)) {
      state.moved = true
    }

    applyPosition({
      x: clamp(state.originX + deltaX, 0, maxX()),
      y: clamp(state.originY + deltaY, 0, maxY()),
    })
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    buttonRef.current?.releasePointerCapture(event.pointerId)

    const current = positionRef.current
    const state = dragState.current

    if (!current) return

    // 松手后吸附到更近的一侧，纵向位置保持不变
    const centerX = current.x + FAB_SIZE / 2
    const nextSide: Side = centerX < window.innerWidth / 2 ? 'left' : 'right'
    const nextY = clamp(current.y, EDGE_GAP, Math.max(EDGE_GAP, maxY() - EDGE_GAP))

    sideRef.current = nextSide
    setSide(nextSide)
    applyPosition({ x: edgeX(nextSide), y: nextY })

    // 记住这次的停靠侧与高度，下次打开页面自动还原
    writeStored(nextSide, nextY)

    // 没有位移则视为点击
    if (!state.moved) {
      setOpen(true)
    }
  }

  const tooltipOnLeft = side === 'right'

  // 首次渲染前不画出来，避免从默认位置“飞”到记住的位置
  if (!position) return null

  // 已隐藏：只在边缘留一个很小的恢复块，点一下搜索球就回来了
  if (hidden) {
    return createPortal(
      <button
        type="button"
        onClick={() => setHiddenPersisted(false)}
        title="显示搜索球"
        aria-label="显示搜索球"
        style={{
          left: `${side === 'left' ? 0 : window.innerWidth - TAB_SIZE}px`,
          top: `${position.y + (FAB_SIZE - TAB_SIZE) / 2}px`,
          height: `${TAB_SIZE}px`,
          width: `${TAB_SIZE * 0.7}px`,
        }}
        className={`fixed z-[80] flex items-center justify-center bg-white/80 text-slate-400 opacity-40 shadow-md backdrop-blur-sm transition-opacity hover:opacity-100 dark:bg-slate-900/80 dark:text-slate-500 ${
          side === 'left' ? 'rounded-r-full' : 'rounded-l-full'
        }`}
      >
        <Search className="h-3.5 w-3.5" />
      </button>,
      document.body,
    )
  }

  return createPortal(
    <>
      <div
        ref={buttonRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          draggingRef.current = false
          setDragging(false)
        }}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          touchAction: 'none',
          transition: dragging
            ? 'none'
            : 'left 240ms cubic-bezier(0.22,1,0.36,1), top 240ms cubic-bezier(0.22,1,0.36,1)',
        }}
        className={`group fixed z-[80] h-12 w-12 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <button
          type="button"
          aria-label="搜索工具（可拖动）"
          className={`flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-[#78b0fb] to-[#3d82dc] text-white shadow-md shadow-blue-500/40 hover:shadow-lg hover:shadow-blue-500/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:shadow-blue-950/60 ${
            dragging ? 'scale-105 shadow-xl shadow-blue-500/60' : 'hover:scale-110'
          } transition-transform duration-200`}
        >
          <Search className={`h-5 w-5 ${dragging ? 'scale-90' : ''} transition-transform duration-200`} />
        </button>

        {/* 悬停时出现的小叉，点击隐藏搜索球 */}
        <button
          type="button"
          aria-label="隐藏搜索球"
          title="隐藏搜索球（可在屏幕边缘点回来）"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation()
            setHiddenPersisted(true)
          }}
          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 dark:border-white/15 dark:bg-slate-800 dark:text-slate-300"
        >
          <X className="h-2.5 w-2.5" />
        </button>

        <span
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-white dark:text-slate-900 ${
            tooltipOnLeft ? 'right-full mr-2.5' : 'left-full ml-2.5'
          }`}
        >
          搜索工具 · 可拖动
        </span>
      </div>

      <SiteSearchPanel open={open} onClose={() => setOpen(false)} />
    </>,
    document.body,
  )
}
