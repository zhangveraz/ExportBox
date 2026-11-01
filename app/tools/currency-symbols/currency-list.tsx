// 名称: 货币查询列表
// 描述: 按地区展示紧凑货币卡片及复制、收藏操作
// 路径: ExportBox/app/tools/currency-symbols/currency-list.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Coins, Star, StarOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { CURRENCY_REGIONS, formatCurrencyExample, type Currency } from '@/lib/tools/currency-symbols'

interface CurrencyListProps {
  groupedCurrencies: Record<string, Currency[]>
  filteredCount: number
  selectedRegion: string
  favorites: readonly string[]
  onToggleFavorite: (code: string) => void
}

export function CurrencyList(props: CurrencyListProps) {
  if (props.selectedRegion === 'favorites' && props.favorites.length === 0) {
    return (
      <div className="py-8 text-center">
        <Star className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-[12px] text-muted-foreground">还没有收藏任何货币，点击星标收藏常用货币</p>
      </div>
    )
  }
  if (props.filteredCount === 0) {
    return (
      <div className="py-8 text-center">
        <Coins className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-[12px] text-muted-foreground">没有找到匹配的货币</p>
      </div>
    )
  }

  return <div className="space-y-2">
    {Object.entries(props.groupedCurrencies).map(([region, currencies]) => (
      <div key={region}>
        {props.selectedRegion === 'all' && (
          <h3 className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold">
            <Badge variant="outline" className="px-1.5 py-0 text-[10px]">{CURRENCY_REGIONS[region] || region}</Badge>
            <span className="text-[10px] font-normal text-muted-foreground">{currencies.length} 种</span>
          </h3>
        )}
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {currencies.map((currency) => (
            <div
              key={currency.code}
              className={`group rounded-md border bg-white/80 px-2 py-1.5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 dark:bg-slate-950/50 dark:hover:border-cyan-300/40 ${props.favorites.includes(currency.code) ? 'border-amber-300 ring-1 ring-amber-300/60' : 'border-slate-200/80 dark:border-white/10'}`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-6 shrink-0 text-center text-lg leading-6 font-bold text-primary" title={currency.symbol}>{currency.symbol}</span>
                <span className="shrink-0 text-[12px] font-semibold">{currency.code}</span>
                <span className="min-w-0 flex-1 truncate text-[10px] text-muted-foreground" title={`${currency.name} (${currency.nameEn})`}>{currency.name}</span>
                <button
                  type="button"
                  onClick={() => props.onToggleFavorite(currency.code)}
                  aria-label={`${props.favorites.includes(currency.code) ? '取消收藏' : '收藏'} ${currency.code}`}
                  className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-amber-500"
                >
                  {props.favorites.includes(currency.code) ? <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="mt-0.5 flex items-center gap-1">
                <span className="min-w-0 flex-1 truncate text-[10px] text-muted-foreground" title={`${currency.country} (${currency.countryEn})`}>{currency.country}</span>
                {currency.popular && <Badge className="shrink-0 bg-blue-500 px-1 py-0 text-[9px]">常用</Badge>}
                {currency.trading && <Badge className="shrink-0 bg-green-500 px-1 py-0 text-[9px]">贸易</Badge>}
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-slate-600 dark:text-slate-300" title={formatCurrencyExample(currency.symbol, currency.decimals)}>{formatCurrencyExample(currency.symbol, currency.decimals)}</span>
                <EnhancedCopyButton text={currency.symbol} variant="ghost" size="sm" className="h-5 shrink-0 px-1 text-[10px]">符号</EnhancedCopyButton>
                <EnhancedCopyButton text={currency.code} variant="ghost" size="sm" className="h-5 shrink-0 px-1 text-[10px]">代码</EnhancedCopyButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
}
