// 名称: 外贸术语浏览器
// 描述: 术语 / 贸易术语 / 邮件句式 / 缩写四合一检索，支持收藏、只看收藏与导出收藏
// 路径: ExportBox/app/tools/glossary/glossary-browser.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, BookMarked, Download, Search, Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { useStoredStringArray } from '@/lib/client-hooks'
import {
  GLOSSARY_ABBR,
  GLOSSARY_CATEGORIES,
  GLOSSARY_PHRASES,
  GLOSSARY_TERMS,
  GLOSSARY_TOTAL,
} from '@/lib/tools/glossary-data'
import { INCOTERMS_2020, type IncotermTransportMode } from '@/lib/tools/incoterms'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 30
const DOWNLOAD_HREF = '/downloads/foreign-trade-glossary-2026-11.xlsx'
const DOWNLOAD_NAME = '外贸术语中英对照表_2026-11.xlsx'
const FAVORITES_KEY = 'glossary-favorites'

type Mode = 'term' | 'incoterms' | 'phrase' | 'abbr'

const MODES: Array<{ id: Mode; label: string; count: number }> = [
  { id: 'term', label: '术语对照', count: GLOSSARY_TERMS.length },
  { id: 'incoterms', label: '贸易术语', count: INCOTERMS_2020.length },
  { id: 'phrase', label: '邮件句式', count: GLOSSARY_PHRASES.length },
  { id: 'abbr', label: '缩写速查', count: GLOSSARY_ABBR.length },
]

/* ------------------------------ 收藏标识 ------------------------------ */

const termKey = (id: string) => `term:${id}`
const incKey = (code: string) => `inc:${code}`
const phraseKey = (id: string) => `phrase:${id}`
const abbrKey = (abbr: string, full: string) => `abbr:${abbr}|${full}`

export function GlossaryBrowser() {
  const [mode, setMode] = useState<Mode>('term')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [transport, setTransport] = useState<'all' | IncotermTransportMode>('all')
  const [favOnly, setFavOnly] = useState(false)
  const [visible, setVisible] = useState(PAGE_SIZE)

  const [favorites, updateFavorites] = useStoredStringArray(FAVORITES_KEY)
  const favoriteSet = useMemo(() => new Set(favorites), [favorites])

  const keyword = query.trim().toLowerCase()

  function toggleFavorite(key: string) {
    updateFavorites((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]))
  }

  const matchedTerms = useMemo(() => {
    const base = category === 'all' ? GLOSSARY_TERMS : GLOSSARY_TERMS.filter((term) => term.category === category)
    const searched = !keyword
      ? base
      : base.filter((term) =>
          term.zh.toLowerCase().includes(keyword) ||
          term.en.toLowerCase().includes(keyword) ||
          term.abbr.toLowerCase().includes(keyword) ||
          term.meaning.toLowerCase().includes(keyword)
        )
    return favOnly ? searched.filter((term) => favoriteSet.has(termKey(term.id))) : searched
  }, [category, keyword, favOnly, favoriteSet])

  const matchedIncoterms = useMemo(() => {
    const byTransport = transport === 'all' ? INCOTERMS_2020 : INCOTERMS_2020.filter((item) => item.mode === transport)
    const searched = !keyword
      ? byTransport
      : byTransport.filter((item) =>
          item.code.toLowerCase().includes(keyword) ||
          item.nameCn.toLowerCase().includes(keyword) ||
          item.nameEn.toLowerCase().includes(keyword) ||
          item.summary.toLowerCase().includes(keyword) ||
          item.typicalUse.toLowerCase().includes(keyword)
        )
    return favOnly ? searched.filter((item) => favoriteSet.has(incKey(item.code))) : searched
  }, [transport, keyword, favOnly, favoriteSet])

  const matchedPhrases = useMemo(() => {
    const searched = !keyword
      ? GLOSSARY_PHRASES
      : GLOSSARY_PHRASES.filter((item) =>
          item.scene.toLowerCase().includes(keyword) ||
          item.zh.toLowerCase().includes(keyword) ||
          item.en.toLowerCase().includes(keyword) ||
          item.tip.toLowerCase().includes(keyword)
        )
    return favOnly ? searched.filter((item) => favoriteSet.has(phraseKey(item.id))) : searched
  }, [keyword, favOnly, favoriteSet])

  const matchedAbbr = useMemo(() => {
    const searched = !keyword
      ? GLOSSARY_ABBR
      : GLOSSARY_ABBR.filter((item) =>
          item.abbr.toLowerCase().includes(keyword) ||
          item.full.toLowerCase().includes(keyword) ||
          item.zh.toLowerCase().includes(keyword) ||
          item.group.toLowerCase().includes(keyword)
        )
    return favOnly ? searched.filter((item) => favoriteSet.has(abbrKey(item.abbr, item.full))) : searched
  }, [keyword, favOnly, favoriteSet])

  const totalMatched =
    mode === 'term'
      ? matchedTerms.length
      : mode === 'incoterms'
        ? matchedIncoterms.length
        : mode === 'phrase'
          ? matchedPhrases.length
          : matchedAbbr.length

  const favoriteCount = favorites.length

  function switchMode(next: Mode) {
    setMode(next)
    setVisible(PAGE_SIZE)
  }

  function switchCategory(next: string) {
    setCategory(next)
    setVisible(PAGE_SIZE)
  }

  function exportFavorites() {
    const rows: string[][] = [['类型', '分类 / 场景', '中文', '英文', '缩写', '释义 / 说明']]

    for (const term of GLOSSARY_TERMS) {
      if (!favoriteSet.has(termKey(term.id))) continue
      const categoryName = GLOSSARY_CATEGORIES.find((item) => item.id === term.category)?.name ?? term.category
      rows.push(['术语', categoryName, term.zh, term.en, term.abbr, [term.meaning, term.usage && `搭配：${term.usage}`, term.note && `注意：${term.note}`].filter(Boolean).join('；')])
    }

    for (const item of INCOTERMS_2020) {
      if (!favoriteSet.has(incKey(item.code))) continue
      rows.push([
        '贸易术语',
        item.mode === 'sea' ? '仅海运' : '任意运输方式',
        `${item.code} ${item.nameCn}`,
        item.nameEn,
        item.code,
        [item.summary, `风险转移：${item.riskTransfer}`, `卖方费用：${item.sellerCost}`, `买方费用：${item.buyerCost}`, `常见场景：${item.typicalUse}`].join('；'),
      ])
    }

    for (const item of GLOSSARY_PHRASES) {
      if (!favoriteSet.has(phraseKey(item.id))) continue
      rows.push(['邮件句式', item.scene, item.zh, item.en, '', item.tip])
    }

    for (const item of GLOSSARY_ABBR) {
      if (!favoriteSet.has(abbrKey(item.abbr, item.full))) continue
      rows.push(['缩写', item.group, item.zh, item.full, item.abbr, ''])
    }

    if (rows.length === 1) return
    downloadCsv(`我的外贸术语收藏-${new Date().toISOString().slice(0, 10)}.csv`, rows)
  }

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <Cell label="术语总量" value={String(GLOSSARY_TOTAL)} note={`含 ${INCOTERMS_2020.length} 条贸易术语`} />
        <Cell label="分类" value={String(GLOSSARY_CATEGORIES.length)} note="业务环节分组" />
        <Cell label="我的收藏" value={String(favoriteCount)} note={favoriteCount ? '可只看 / 可导出' : '点星标即可收藏'} />
        <Cell label="当前匹配" value={String(totalMatched)} note={favOnly ? '仅收藏范围' : '全部条目范围'} />
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><BookMarked className="h-3.5 w-3.5" />检索</CardTitle>
            <p className="mt-0.5 truncate text-[10px] leading-[17px] text-muted-foreground">支持中文、英文、缩写与释义关键词，例如 FOB / 提单 / B/L / 退税</p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              aria-pressed={favOnly}
              onClick={() => { setFavOnly((value) => !value); setVisible(PAGE_SIZE) }}
              className={cn(
                'inline-flex h-7 shrink-0 items-center gap-1 rounded-md border px-2 text-[11px] font-medium transition-colors',
                favOnly
                  ? 'border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-300/50 dark:bg-amber-300/10 dark:text-amber-200'
                  : 'border-slate-200 text-muted-foreground hover:bg-muted/60 dark:border-white/10'
              )}
            >
              <Star className={cn('h-3.5 w-3.5', favOnly && 'fill-current')} />只看收藏{favoriteCount ? `(${favoriteCount})` : ''}
            </button>
            <button
              type="button"
              onClick={exportFavorites}
              disabled={favoriteCount === 0}
              className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md border border-amber-300 bg-white px-2 text-[11px] font-medium text-amber-700 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-amber-300/40 dark:bg-transparent dark:text-amber-200"
            >
              <Download className="h-3.5 w-3.5" />导出收藏
            </button>
            <a
              href={DOWNLOAD_HREF}
              download={DOWNLOAD_NAME}
              className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md bg-emerald-600 px-2.5 text-[11px] font-medium text-white transition-colors hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" />下载 Excel
            </a>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 px-3 pt-0 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setVisible(PAGE_SIZE) }}
              placeholder="输入中文 / English / 缩写 检索，如 提单、bill of lading、B/L"
              className="h-8 pl-8 text-[12px]"
              aria-label="术语检索"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={mode === item.id}
                onClick={() => switchMode(item.id)}
                className={cn(
                  'h-6 shrink-0 rounded px-2 text-[11px] font-medium transition-colors',
                  mode === item.id ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/70'
                )}
              >
                {item.label}
                <span className={cn('ml-1 text-[10px]', mode === item.id ? 'text-white/80' : 'text-muted-foreground')}>{item.count}</span>
              </button>
            ))}
          </div>

          {mode === 'term' && (
            <div className="flex flex-wrap gap-1">
              <Chip active={category === 'all'} onClick={() => switchCategory('all')}>全部</Chip>
              {GLOSSARY_CATEGORIES.map((item) => (
                <Chip key={item.id} active={category === item.id} onClick={() => switchCategory(item.id)}>
                  {item.name}<span className="ml-1 text-[9px] opacity-70">{item.count}</span>
                </Chip>
              ))}
            </div>
          )}

          {mode === 'incoterms' && (
            <div className="flex flex-wrap gap-1">
              <Chip active={transport === 'all'} onClick={() => setTransport('all')}>全部运输方式</Chip>
              <Chip active={transport === 'any'} onClick={() => setTransport('any')}>任意运输</Chip>
              <Chip active={transport === 'sea'} onClick={() => setTransport('sea')}>仅海运</Chip>
            </div>
          )}
        </CardContent>
      </Card>

      {totalMatched === 0 && (
        <div className="rounded-lg border border-dashed px-3 py-6 text-center text-[11px] text-muted-foreground">
          {favOnly ? '收藏里还没有匹配的条目，关掉「只看收藏」再挑几条吧。' : '没有匹配结果，试试更短的关键词或切换分类。'}
        </div>
      )}

      {mode === 'term' && matchedTerms.length > 0 && (
        <>
          <div className="grid gap-2 md:grid-cols-2 2xl:grid-cols-3">
            {matchedTerms.slice(0, visible).map((term) => (
              <div key={term.id} className="rounded-md border border-slate-200/80 bg-white/70 px-3 py-2.5 transition-colors hover:border-emerald-300 dark:border-white/10 dark:bg-white/3">
                <div className="flex items-start justify-between gap-1.5">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-1">
                      <span className="text-[13px] font-semibold leading-5">{term.zh}</span>
                      {term.abbr && <Badge variant="outline" className="h-4 px-1 font-mono text-[9px]">{term.abbr}</Badge>}
                    </p>
                    <p className="truncate font-mono text-[11px] leading-[17px] text-muted-foreground" title={term.en}>{term.en}</p>
                  </div>
                  <RowActions
                    favorite={favoriteSet.has(termKey(term.id))}
                    onToggle={() => toggleFavorite(termKey(term.id))}
                    text={`${term.zh} — ${term.en}${term.abbr ? ` (${term.abbr})` : ''}`}
                    title="复制中英对照"
                  />
                </div>
                {term.meaning && <p className="mt-1.5 line-clamp-2 text-[11px] leading-[18px] text-slate-600 dark:text-slate-300">{term.meaning}</p>}
                {term.usage && <p className="mt-1 line-clamp-1 text-[10px] leading-[17px] text-muted-foreground" title={term.usage}>搭配：{term.usage}</p>}
                {term.note && (
                  <p className="mt-1 flex items-start gap-1 text-[10px] leading-[17px] text-amber-700 dark:text-amber-300" title={term.note}>
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                    <span className="line-clamp-1">{term.note}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
          {matchedTerms.length > visible && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setVisible((count) => count + PAGE_SIZE)} className="h-7 px-3 text-[11px]">
                加载更多（还有 {matchedTerms.length - visible} 条）
              </Button>
            </div>
          )}
        </>
      )}

      {mode === 'incoterms' && matchedIncoterms.length > 0 && (
        <div className="grid gap-2 md:grid-cols-2 2xl:grid-cols-3">
          {matchedIncoterms.map((item) => (
            <div key={item.code} className="rounded-md border border-slate-200/80 bg-white/70 px-3 py-2.5 transition-colors hover:border-emerald-300 dark:border-white/10 dark:bg-white/3">
              <div className="flex items-start justify-between gap-1.5">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-1">
                    <span className="rounded bg-indigo-50 px-1 font-mono text-[12px] font-bold leading-5 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-200">{item.code}</span>
                    <span className="text-[13px] font-semibold leading-5">{item.nameCn}</span>
                    <Badge variant="outline" className="h-4 px-1 text-[9px]">{item.mode === 'sea' ? '仅海运' : '任意运输'}</Badge>
                  </p>
                  <p className="truncate font-mono text-[11px] leading-[17px] text-muted-foreground" title={item.nameEn}>{item.nameEn}</p>
                </div>
                <RowActions
                  favorite={favoriteSet.has(incKey(item.code))}
                  onToggle={() => toggleFavorite(incKey(item.code))}
                  text={`${item.code} ${item.nameCn} — ${item.nameEn}｜风险转移：${item.riskTransfer}｜卖方：${item.sellerCost}｜买方：${item.buyerCost}`}
                  title="复制贸易术语说明"
                />
              </div>
              <p className="mt-0.5 text-[11px] leading-4 text-slate-600 dark:text-slate-300">{item.summary}</p>
              <dl className="mt-1.5 grid grid-cols-1 gap-x-3 gap-y-1 text-[10px] leading-[17px] sm:grid-cols-2">
                <Line label="风险转移" value={item.riskTransfer} />
                <Line label="常见场景" value={item.typicalUse} />
                <Line label="卖方费用" value={item.sellerCost} />
                <Line label="买方费用" value={item.buyerCost} />
              </dl>
            </div>
          ))}
        </div>
      )}

      {mode === 'phrase' && matchedPhrases.length > 0 && (
        <Card>
          <CardHeader className="px-3 pt-2.5 pb-1.5">
            <CardTitle className="text-sm font-semibold">高频邮件句式<span className="ml-1.5 text-[10px] font-normal text-muted-foreground">共 {matchedPhrases.length} 条</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 px-3 pt-0 pb-3">
            {matchedPhrases.map((item) => (
              <div key={item.id} className="rounded-md border-b px-1 py-2.5 last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="h-4 shrink-0 px-1 text-[9px]">{item.scene}</Badge>
                      <p className="truncate text-[11px] leading-4 text-muted-foreground">{item.zh}</p>
                    </div>
                    <p className="mt-0.5 break-words font-mono text-[11px] leading-4">{item.en}</p>
                    {item.tip && <p className="mt-0.5 text-[10px] leading-4 text-amber-700 dark:text-amber-300">{item.tip}</p>}
                  </div>
                  <RowActions
                    favorite={favoriteSet.has(phraseKey(item.id))}
                    onToggle={() => toggleFavorite(phraseKey(item.id))}
                    text={item.en}
                    title="复制英文句式"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {mode === 'abbr' && matchedAbbr.length > 0 && (
        <div className="grid gap-2 md:grid-cols-2 2xl:grid-cols-4">
          {matchedAbbr.map((item) => (
            <div key={`${item.abbr}-${item.full}`} className="flex items-start justify-between gap-1.5 rounded-md border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/3">
              <div className="min-w-0">
                <p className="font-mono text-[12px] font-bold leading-4">{item.abbr}</p>
                <p className="truncate text-[10px] leading-[17px] text-muted-foreground" title={item.full}>{item.full}</p>
                <p className="truncate text-[10px] leading-[17px]" title={item.zh}>{item.zh}</p>
              </div>
              <RowActions
                favorite={favoriteSet.has(abbrKey(item.abbr, item.full))}
                onToggle={() => toggleFavorite(abbrKey(item.abbr, item.full))}
                text={`${item.abbr} — ${item.full}`}
                title="复制缩写释义"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------ 小组件 ------------------------------ */

function Cell({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
      <p className="truncate text-[10px] leading-[17px] text-muted-foreground">{label}</p>
      <p className="text-[13px] font-semibold leading-5 tabular-nums">{value}</p>
      <p className="truncate text-[10px] leading-[17px] text-muted-foreground">{note}</p>
    </div>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1 text-slate-600 dark:text-slate-300">{value}</dd>
    </div>
  )
}

function RowActions({ favorite, onToggle, text, title }: { favorite: boolean; onToggle: () => void; text: string; title: string }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={favorite}
        aria-label={favorite ? `${title}·取消收藏` : `${title}·加入收藏`}
        title={favorite ? '取消收藏' : '加入收藏'}
        className={cn(
          'inline-flex h-6 w-6 items-center justify-center rounded transition-colors',
          favorite ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-400/10' : 'text-muted-foreground/60 hover:bg-muted hover:text-amber-500'
        )}
      >
        <Star className={cn('h-3.5 w-3.5', favorite && 'fill-current')} />
      </button>
      <EnhancedCopyButton text={text} iconOnly title={title} className="h-6 w-6" />
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'h-6 rounded border px-1.5 text-[10px] font-medium leading-4 transition-colors',
        active ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-cyan-300/50 dark:bg-cyan-300/10 dark:text-cyan-200' : 'border-slate-200 text-muted-foreground hover:bg-muted/60 dark:border-white/10'
      )}
    >
      {children}
    </button>
  )
}

/* ------------------------------ CSV 导出 ------------------------------ */

function csvCell(value: string | undefined) {
  const text = value ?? ''
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function downloadCsv(filename: string, rows: string[][]) {
  // 前面加 BOM，Excel 打开中文才不会乱码
  const content = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
