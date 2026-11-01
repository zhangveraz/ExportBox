// 名称: 国家信息筛选控件
// 描述: 主要贸易国快捷入口、搜索、大洲筛选、收藏与导出（单屏紧凑版）
// 路径: ExportBox/app/tools/global-country-info/country-controls.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Download, Filter, Map, Search, Star, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { COUNTRY_DATA, getContinents, getFlagEmoji, type CountryInfo } from '@/lib/tools/global-country-info'
import { MAJOR_TRADE_COUNTRIES } from './country-page-data'

export function MajorTradeCountries({ showOnlyMajorTrade, onSelect, onToggleFilter }: { showOnlyMajorTrade: boolean; onSelect: (country: CountryInfo) => void; onToggleFilter: () => void }) {
  const countries = COUNTRY_DATA.filter((country) => MAJOR_TRADE_COUNTRIES.includes(country.iso2))
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <TrendingUp className="h-3.5 w-3.5" />
          主要外贸伙伴国
          <span className="text-[10px] font-normal text-muted-foreground">贸易额前 {countries.length}</span>
        </CardTitle>
        <Button variant="ghost" onClick={onToggleFilter} className="h-6 shrink-0 px-2 text-[11px]">
          {showOnlyMajorTrade ? '显示所有国家' : '仅看贸易大国'}
        </Button>
      </CardHeader>
      <CardContent className="px-3 pt-0 pb-3">
        <div className="grid grid-cols-4 gap-1 sm:grid-cols-5 lg:grid-cols-10">
          {countries.map((country) => (
            <button
              key={country.iso2}
              type="button"
              onClick={() => onSelect(country)}
              title={`${country.name_cn} ${country.name_en}`}
              className="flex h-8 items-center justify-center gap-1 truncate rounded-md border border-slate-200/80 px-1 text-[10px] font-medium transition-colors hover:border-emerald-300 hover:bg-emerald-50/70 dark:border-white/10 dark:hover:border-cyan-300/40 dark:hover:bg-cyan-300/10"
            >
              <span className="text-sm leading-none">{getFlagEmoji(country.iso2)}</span>
              <span className="truncate">{country.name_cn}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface CountryControlsProps {
  searchTerm: string
  continentFilter: string
  showOnlyFavorites: boolean
  resultCount: number
  favoriteCount: number
  onSearch: (value: string) => void
  onContinent: (value: string) => void
  onToggleFavorites: () => void
  onExport: () => void
}

export function CountryControls(props: CountryControlsProps) {
  return (
    <Card>
      <CardContent className="space-y-2 px-3 pt-2.5 pb-3">
        <div className="grid gap-2 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto_auto]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="搜索国家、代码、区号…"
              value={props.searchTerm}
              onChange={(event) => props.onSearch(event.target.value)}
              className="h-8 pl-8 text-[12px]"
              aria-label="搜索国家"
            />
          </div>
          <Select value={props.continentFilter} onValueChange={props.onContinent}>
            <SelectTrigger className="h-8 text-[12px]" aria-label="筛选大洲"><SelectValue placeholder="筛选大洲" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有大洲</SelectItem>
              {getContinents().map((continent) => <SelectItem key={continent} value={continent}>{continent}</SelectItem>)}
              <SelectItem value="跨洲国家"><span className="flex items-center gap-1"><Map className="h-3 w-3" />跨洲国家</span></SelectItem>
            </SelectContent>
          </Select>
          <Button variant={props.showOnlyFavorites ? 'default' : 'outline'} onClick={props.onToggleFavorites} className="h-8 px-2.5 text-[11px]">
            <Star className={`mr-1 h-3.5 w-3.5 ${props.showOnlyFavorites ? 'fill-current' : ''}`} />{props.showOnlyFavorites ? '只看收藏' : '全部国家'}
          </Button>
          <Button variant="outline" onClick={props.onExport} className="h-8 px-2.5 text-[11px]">
            <Download className="mr-1 h-3.5 w-3.5" />导出 CSV
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
          <Filter className="h-3 w-3" />
          <span>共 {props.resultCount} 个国家/地区</span>
          {props.favoriteCount > 0 && <Badge variant="secondary" className="h-4 px-1 text-[10px]">已收藏 {props.favoriteCount} 个</Badge>}
          <span className="ml-auto">点击表头可排序 · 点击「眼睛」看商务礼仪</span>
        </div>
      </CardContent>
    </Card>
  )
}
