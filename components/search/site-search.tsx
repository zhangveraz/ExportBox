// 名称: 站内工具搜索
// 描述: 提供可复用的搜索面板与页头入口，支持按名称、分类与关键词检索工具并快速跳转
// 路径: ExportBox/components/search/site-search.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CornerDownLeft, Search, Star, X } from 'lucide-react'
import { FavoriteButton } from '@/components/tools/favorite-button'
import { TOOL_REGISTRY } from '@/lib/tools/registry'
import { useFavorites } from '@/lib/tools/personalization'
import { cn } from '@/lib/utils'

interface SearchEntry {
  id: string
  slug: string
  title: string
  shortTitle: string
  description: string
  category: string
  href: string
  haystack: string
}

const SEARCH_INDEX: SearchEntry[] = TOOL_REGISTRY.map((tool) => ({
  id: tool.id,
  slug: tool.slug,
  title: tool.title,
  shortTitle: tool.shortTitle ?? tool.title,
  description: tool.description,
  category: tool.category,
  href: tool.href,
  haystack: [tool.title, tool.shortTitle, tool.description, tool.category, ...(tool.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase(),
}))

function matchTools(query: string): SearchEntry[] {
  const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (keywords.length === 0) return []

  return SEARCH_INDEX.filter((entry) => keywords.every((word) => entry.haystack.includes(word)))
    .map((entry) => {
      const titleHit = keywords.every((word) => entry.title.toLowerCase().includes(word))
      const categoryHit = keywords.every((word) => entry.category.toLowerCase().includes(word))
      return { entry, score: titleHit ? 2 : categoryHit ? 1 : 0 }
    })
    .sort((a, b) => b.score - a.score || a.entry.title.length - b.entry.title.length)
    .slice(0, 12)
    .map((item) => item.entry)
}

interface SiteSearchPanelProps {
  open: boolean
  onClose: () => void
}

/** 搜索面板本体，可被页头、悬浮球等任意入口复用 */
export function SiteSearchPanel({ open, onClose }: SiteSearchPanelProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const favorites = useFavorites()

  const results = useMemo(() => matchTools(query), [query])
  // 没输入关键词时，面板上半部分显示用户的收藏，底部还能直接搜
  const favoriteEntries = useMemo(
    () =>
      favorites
        .map((slug) => SEARCH_INDEX.find((entry) => entry.slug === slug))
        .filter((entry): entry is SearchEntry => Boolean(entry)),
    [favorites]
  )

  const close = useCallback(() => {
    setQuery('')
    setActiveIndex(0)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30)
    document.body.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [open])

  // 输入变化时把高亮拉回第一条（在事件里改，避免 effect 里 setState 触发级联渲染）
  const onQueryChange = (value: string) => {
    setQuery(value)
    setActiveIndex(0)
  }

  // Esc 关闭
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  const goTo = useCallback(
    (href: string) => {
      close()
      router.push(href)
    },
    [close, router]
  )

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => (results.length === 0 ? 0 : (prev + 1) % results.length))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => (results.length === 0 ? 0 : (prev - 1 + results.length) % results.length))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const target = results[activeIndex]
      if (target) goTo(target.href)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[10vh]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/20" onClick={close} aria-hidden="true" />

      <div className="relative w-[min(880px,94vw)] overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl shadow-slate-900/20 dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 dark:border-white/10">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="搜索工具名称、分类或关键词，例如：报价、装箱、发票"
            className="h-16 w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={close}
            aria-label="关闭搜索"
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {query.trim() === '' && (
            <div className="pb-1">
              <div className="flex items-center justify-between px-5 py-2">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  我的收藏
                  {favoriteEntries.length > 0 && <span className="font-normal text-slate-400">· {favoriteEntries.length}</span>}
                </p>
                {favoriteEntries.length > 0 && (
                  <Link
                    href="/favorites"
                    onClick={close}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-cyan-300 dark:hover:text-cyan-200"
                  >
                    查看全部
                  </Link>
                )}
              </div>

              {favoriteEntries.length === 0 ? (
                <p className="px-5 py-5 text-center text-sm text-slate-400 dark:text-slate-500">
                  还没有收藏工具 · 搜索结果右侧点星标即可收藏
                </p>
              ) : (
                <div className="pb-2">
                  {favoriteEntries.slice(0, 6).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 px-3 hover:bg-slate-50 dark:hover:bg-white/5">
                      <Link href={item.href} onClick={close} className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-2 py-2.5">
                        <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-500" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{item.shortTitle}</span>
                          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{item.category}</span>
                        </span>
                      </Link>
                      <FavoriteButton slug={item.slug} />
                    </div>
                  ))}
                </div>
              )}

              <p className="px-5 py-3 text-center text-xs text-slate-400 dark:text-slate-500">
                输入关键词开始搜索，共 {SEARCH_INDEX.length} 个工具
              </p>
            </div>
          )}

          {query.trim() !== '' && results.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
              没有找到匹配的工具，换个关键词试试
            </p>
          )}

          {results.map((item, index) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                'flex items-start gap-2',
                index === activeIndex ? 'bg-blue-50/80 dark:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'
              )}
            >
              <Link href={item.href} onClick={close} className="flex min-w-0 flex-1 items-start gap-4 px-5 py-3 transition-colors">
                <span className="mt-0.5 shrink-0 rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
                  {item.category}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium text-slate-900 dark:text-white">{item.title}</span>
                  <span className="mt-0.5 block truncate text-sm text-slate-500 dark:text-slate-400">{item.description}</span>
                </span>
                {index === activeIndex && <CornerDownLeft className="mt-1 h-4 w-4 shrink-0 text-slate-300 dark:text-slate-500" />}
              </Link>
              <FavoriteButton slug={item.slug} className="mt-3 mr-3" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-2.5 text-[11px] text-slate-400 dark:border-white/10 dark:text-slate-500">
          <span>↑ ↓ 选择 · Enter 打开 · Esc 关闭</span>
          <span>{results.length > 0 ? `${results.length} 个结果` : ''}</span>
        </div>
      </div>
    </div>
  )
}

/** 页头按钮形态的入口（默认未挂载，需要时可在 header 中启用） */
export function SiteSearch() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="搜索工具"
        className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white/70 px-2.5 text-sm text-slate-500 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-300/50 dark:hover:text-cyan-200 sm:px-3"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">搜索工具</span>
        <kbd className="ml-1 hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500 lg:inline-block">
          Ctrl K
        </kbd>
      </button>

      <SiteSearchPanel open={open} onClose={() => setOpen(false)} />
    </>
  )
}
