// 名称: 工具收藏夹与使用频率
// 描述: 用浏览器本地存储记住「收藏的工具」和「每个工具被打开的次数」，供收藏夹、搜索球和手机端高频入口使用
// 路径: ExportBox/lib/tools/personalization.ts
// 作者: ExportBox
// 更新时间: 2026-11-03

'use client'

import { useMemo, useSyncExternalStore } from 'react'

/** 本地存储键：收藏的工具 slug 列表 */
export const FAVORITES_STORAGE_KEY = 'exportbox-favorites'
/** 本地存储键：工具打开次数统计 */
export const USAGE_STORAGE_KEY = 'exportbox-tool-usage'

const CHANGE_EVENT = 'exportbox-personalization-change'
/** 最多记这么多个工具的使用次数，防止本地存储无限膨胀 */
const MAX_USAGE_ENTRIES = 80

// 服务端渲染时统一返回这两个空对象，保证快照引用稳定（否则 React 会判定为死循环）
const EMPTY_FAVORITES: string[] = []
const EMPTY_USAGE: Record<string, number> = {}

let favoritesCache: string[] | null = null
let usageCache: Record<string, number> | null = null

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function parseFavorites(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string' && item.length > 0)
  } catch {
    return []
  }
}

function parseUsage(raw: string | null): Record<string, number> {
  if (!raw) return {}
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const result: Record<string, number> = {}
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        result[key] = value
      }
    }
    return result
  } catch {
    return {}
  }
}

function notifyChange() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** 读取收藏列表（按收藏先后倒序，最新收藏的在最前面） */
export function readFavorites(): string[] {
  if (!hasStorage()) return EMPTY_FAVORITES
  if (favoritesCache === null) {
    try {
      favoritesCache = parseFavorites(window.localStorage.getItem(FAVORITES_STORAGE_KEY))
    } catch {
      favoritesCache = []
    }
  }
  return favoritesCache
}

/** 读取每个工具的打开次数 */
export function readUsage(): Record<string, number> {
  if (!hasStorage()) return EMPTY_USAGE
  if (usageCache === null) {
    try {
      usageCache = parseUsage(window.localStorage.getItem(USAGE_STORAGE_KEY))
    } catch {
      usageCache = {}
    }
  }
  return usageCache
}

/** 是否已收藏 */
export function isFavorite(slug: string): boolean {
  return readFavorites().includes(slug)
}

/** 收藏 / 取消收藏，返回最新收藏列表 */
export function toggleFavorite(slug: string): string[] {
  if (!slug) return readFavorites()
  const current = readFavorites()
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current]
  favoritesCache = next
  if (hasStorage()) {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // 浏览器禁用存储时忽略，本次会话内仍然生效
    }
  }
  notifyChange()
  return next
}

/** 记一次工具打开，用于手机端「高频入口」排序 */
export function recordToolOpen(slug: string): void {
  if (!slug || !hasStorage()) return
  const usage = { ...readUsage() }
  usage[slug] = (usage[slug] ?? 0) + 1

  const trimmed = Object.entries(usage)
    .sort((left, right) => right[1] - left[1])
    .slice(0, MAX_USAGE_ENTRIES)
  const next: Record<string, number> = {}
  for (const [key, value] of trimmed) next[key] = value

  usageCache = next
  try {
    window.localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // 同上，存储不可用时忽略
  }
  notifyChange()
}

/** 按打开次数从高到低取前 N 个工具 slug */
export function topToolSlugs(usage: Record<string, number>, limit: number): string[] {
  return Object.entries(usage)
    .sort((left, right) => (right[1] === left[1] ? left[0].localeCompare(right[0]) : right[1] - left[1]))
    .slice(0, Math.max(0, limit))
    .map(([slug]) => slug)
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = () => onStoreChange()
  window.addEventListener(CHANGE_EVENT, handler)
  // 其它标签页改了收藏，这里也要同步
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

/** 订阅收藏列表的 React Hook */
export function useFavorites(): string[] {
  return useSyncExternalStore(subscribe, readFavorites, () => EMPTY_FAVORITES)
}

/** 订阅使用次数统计的 React Hook */
export function useToolUsage(): Record<string, number> {
  return useSyncExternalStore(subscribe, readUsage, () => EMPTY_USAGE)
}

/** 高频工具 slug 列表（按真实打开次数排序） */
export function useTopToolSlugs(limit: number): string[] {
  const usage = useToolUsage()
  return useMemo(() => topToolSlugs(usage, limit), [usage, limit])
}
