// 名称: 国家信息表格
// 描述: 紧凑表格展示国家列表、排序、展开行与行操作（单屏滚动版）
// 路径: ExportBox/app/tools/global-country-info/country-table.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Fragment } from 'react'
import { ChevronDown, ChevronUp, Clock, DollarSign, Eye, Globe, Globe2, Hash, Languages, Map, MapPin, Phone, Star, StarOff, TrendingUp, Users } from 'lucide-react'
import { CopyButton } from '@/components/tools/copy-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPopulation, getFlagEmoji, getTimeDifference, type CountryInfo } from '@/lib/tools/global-country-info'
import { MAJOR_TRADE_COUNTRIES, TRANSCONTINENTAL_COUNTRIES, type SortField, type SortOrder } from './country-page-data'

interface CountryTableProps {
  countries: CountryInfo[]
  favorites: readonly string[]
  expandedRows: string[]
  sortField: SortField
  sortOrder: SortOrder
  localTimezone: string | null
  onSort: (field: SortField) => void
  onToggleFavorite: (iso2: string) => void
  onToggleRow: (iso2: string) => void
  onSelect: (country: CountryInfo) => void
}

const TH = 'sticky top-0 z-10 whitespace-nowrap bg-muted/90 px-2 py-1.5 text-left text-[10px] font-semibold text-muted-foreground backdrop-blur'

export function CountryTable(props: CountryTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="max-h-[calc(100vh-370px)] overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <SortHeading label="国家 / 地区" field="name" onSort={props.onSort} sortField={props.sortField} sortOrder={props.sortOrder} />
                <SortHeading label="大洲" field="continent" className="hidden md:table-cell" onSort={props.onSort} sortField={props.sortField} sortOrder={props.sortOrder} />
                <th className={TH}>区号</th>
                <th className={`${TH} hidden lg:table-cell`}>国家代码</th>
                <SortHeading label="时差" field="timezone" className={`hidden xl:table-cell`} onSort={props.onSort} sortField={props.sortField} sortOrder={props.sortOrder} />
                <th className={`${TH} hidden xl:table-cell`}>货币</th>
                <th className={`${TH} text-center`}>操作</th>
              </tr>
            </thead>
            <tbody>
              {props.countries.map((country) => (
                <CountryRows key={country.iso2} country={country} favorite={props.favorites.includes(country.iso2)} expanded={props.expandedRows.includes(country.iso2)} localTimezone={props.localTimezone} onToggleFavorite={props.onToggleFavorite} onToggleRow={props.onToggleRow} onSelect={props.onSelect} />
              ))}
            </tbody>
          </table>
          {props.countries.length === 0 && (
            <div className="py-10 text-center">
              <Globe className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-[12px] text-muted-foreground">未找到匹配的国家信息，请调整搜索条件</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function CountryRows({ country, favorite, expanded, localTimezone, onToggleFavorite, onToggleRow, onSelect }: { country: CountryInfo; favorite: boolean; expanded: boolean; localTimezone: string | null; onToggleFavorite: (iso2: string) => void; onToggleRow: (iso2: string) => void; onSelect: (country: CountryInfo) => void }) {
  const difference = localTimezone ? getTimeDifference(country.timezone, localTimezone) : null
  const timeDisplay = difference === null ? '--' : `${difference >= 0 ? '+' : ''}${difference}h`
  const major = MAJOR_TRADE_COUNTRIES.includes(country.iso2)
  const transcontinental = Object.prototype.hasOwnProperty.call(TRANSCONTINENTAL_COUNTRIES, country.iso2)
  return (
    <Fragment>
      <tr className={`border-b transition-colors hover:bg-muted/40 ${favorite ? 'bg-yellow-50/60 dark:bg-yellow-900/10' : ''}`}>
        <td className="px-2 py-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none">{getFlagEmoji(country.iso2)}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="truncate text-[12px] font-medium leading-4">{country.name_cn}</span>
                {major && <Badge className="h-4 shrink-0 px-1 text-[9px]"><TrendingUp className="mr-0.5 h-2.5 w-2.5" />贸易大国</Badge>}
              </div>
              <div className="truncate text-[10px] leading-4 text-muted-foreground">{country.name_en}</div>
            </div>
          </div>
        </td>
        <td className="hidden px-2 py-1 md:table-cell">
          {transcontinental
            ? <Badge variant="outline" className="h-4 px-1 text-[9px]"><Map className="mr-0.5 h-2.5 w-2.5" />跨洲</Badge>
            : <Badge variant="outline" className="h-4 px-1 text-[9px]">{country.continent_cn}</Badge>}
        </td>
        <td className="px-2 py-1">
          <span className="flex items-center gap-1 font-mono text-[11px] tabular-nums">
            {country.dial_code}
            <CopyButton text={country.dial_code} className="h-5 w-5" />
          </span>
        </td>
        <td className="hidden px-2 py-1 lg:table-cell">
          <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
            {country.iso2} / {country.iso3}
            <CopyButton text={`${country.iso2} / ${country.iso3}`} className="h-5 w-5" />
          </span>
        </td>
        <td className="hidden px-2 py-1 xl:table-cell">
          <span className="flex items-center gap-1 font-mono text-[11px] tabular-nums"><Clock className="h-3 w-3 text-muted-foreground" />{timeDisplay}</span>
        </td>
        <td className="hidden px-2 py-1 xl:table-cell">
          <span className="flex items-center gap-1 text-[11px]"><span className="text-xs">{country.currency_symbol}</span>{country.currency_code}</span>
        </td>
        <td className="px-2 py-1">
          <div className="flex items-center justify-center gap-0.5">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onToggleFavorite(country.iso2)} title="收藏">
              {favorite ? <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onSelect(country)} title="查看详情">
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 lg:hidden" onClick={() => onToggleRow(country.iso2)} title="展开更多">
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="lg:hidden">
          <td colSpan={7} className="bg-muted/30 px-2 py-1.5">
            <div className="grid gap-1 text-[11px] leading-4">
              <MobileRow icon={Globe2} label="大洲" value={country.continent_cn}>{transcontinental && <Badge variant="secondary" className="h-4 px-1 text-[9px]">跨洲国家</Badge>}</MobileRow>
              <MobileRow icon={MapPin} label="首都" value={`${country.capital_cn} (${country.capital_en})`} />
              <MobileRow icon={Hash} label="代码" value={`${country.iso2} / ${country.iso3}`} mono><CopyButton text={`${country.iso2} / ${country.iso3}`} className="h-5 w-5" /></MobileRow>
              <MobileRow icon={Clock} label="时差" value={timeDisplay} mono />
              <MobileRow icon={DollarSign} label="货币" value={`${country.currency_name_cn} (${country.currency_symbol} ${country.currency_code})`} />
              <MobileRow icon={Globe} label="域名" value={country.tld} mono />
              <MobileRow icon={Languages} label="语言" value={country.language_cn.join(', ')} />
              <MobileRow icon={Users} label="人口" value={formatPopulation(country.population)} />
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  )
}

function SortHeading({ label, field, className = '', onSort, sortField, sortOrder }: { label: string; field: SortField; className?: string; onSort: (field: SortField) => void; sortField: SortField; sortOrder: SortOrder }) {
  return (
    <th className={`${TH} ${className}`}>
      <button type="button" onClick={() => onSort(field)} className="inline-flex items-center gap-0.5 font-semibold hover:text-foreground">
        {label}
        {sortField === field && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
      </button>
    </th>
  )
}

function MobileRow({ icon: Icon, label, value, mono = false, children }: { icon: typeof Globe; label: string; value: string; mono?: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className={mono ? 'truncate font-mono' : 'truncate'}>{value}</span>
      {children}
    </div>
  )
}
