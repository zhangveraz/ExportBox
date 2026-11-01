// 名称: 节假日国家查询
// 描述: 展示查询条件、国家信息、年度提示和节假日列表
// 路径: ExportBox/app/tools/holiday-query/holiday-country-tab.tsx
// 作者: ExportBox
// 更新时间: 2026-07-15

import { AlertCircle, Calendar, Info, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getHolidayTypeName, getImpactLevelName, isPredictedYear, SUPPORTED_HOLIDAY_YEARS, type Country, type Holiday } from '@/lib/tools/holiday-query'
import { formatCalendarDateKey } from '@/lib/date-utils'

const HOT_COUNTRIES = ['US', 'GB', 'DE', 'JP', 'FR', 'IN', 'AU', 'CA', 'KR', 'BR', 'AE', 'SG']

interface HolidayCountryTabProps {
  selectedCountry: string
  selectedYear: string
  selectedMonth: string
  selectedRegion: string
  selectedYearNumber: number
  countryInfo?: Country
  countries: Record<string, Country>
  filteredCountries: Array<[string, Country]>
  filteredHolidays: Holiday[]
  regionNames: string[]
  onCountry: (value: string) => void
  onYear: (value: string) => void
  onMonth: (value: string) => void
  onRegion: (value: string) => void
}

export function HolidayCountryTab(props: HolidayCountryTabProps) {
  return <div className="space-y-2.5">
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      <SelectField id="region" label="地区" value={props.selectedRegion} onChange={props.onRegion}><SelectItem value="all">全部地区</SelectItem>{props.regionNames.map((region) => <SelectItem key={region} value={region}>{region}</SelectItem>)}</SelectField>
      <div><Label htmlFor="country" className="mb-1 block text-[11px] text-muted-foreground">国家 / 地区</Label><Select value={props.selectedCountry} onValueChange={props.onCountry}><SelectTrigger id="country" className="h-8 text-[13px]"><SelectValue /></SelectTrigger><SelectContent className="max-h-[300px]"><SelectItem value="divider-hot" disabled><span className="flex items-center gap-2 font-semibold text-orange-600"><TrendingUp className="h-3.5 w-3.5" />热门国家</span></SelectItem>{HOT_COUNTRIES.map((code) => { const country = props.countries[code]; return country ? <SelectItem key={code} value={code}><span className="flex items-center gap-2"><span>{country.flag}</span><span>{country.name}</span><Badge variant="outline" className="ml-auto text-xs">热门</Badge></span></SelectItem> : null })}<SelectItem value="divider-all" disabled><span className="font-semibold">所有国家/地区</span></SelectItem>{props.filteredCountries.map(([code, country]) => <SelectItem key={code} value={code}><span className="flex items-center gap-2"><span>{country.flag}</span><span>{country.name}</span><span className="ml-auto text-xs text-muted-foreground">{country.region}</span></span></SelectItem>)}</SelectContent></Select></div>
      <SelectField id="year" label="年份" value={props.selectedYear} onChange={props.onYear}>{SUPPORTED_HOLIDAY_YEARS.map((year) => <SelectItem key={year} value={year.toString()}>{year}年{isPredictedYear(year) ? '（预测）' : '（已确认）'}</SelectItem>)}</SelectField>
      <SelectField id="month" label="月份" value={props.selectedMonth} onChange={props.onMonth}><SelectItem value="all">全年</SelectItem>{Array.from({ length: 12 }, (_, index) => <SelectItem key={index + 1} value={(index + 1).toString()}>{index + 1}月</SelectItem>)}</SelectField>
    </div>
    {props.countryInfo && <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-1.5"><div className="flex min-w-0 items-center gap-2"><span className="text-xl leading-none">{props.countryInfo.flag}</span><div className="min-w-0"><p className="truncate text-[13px] font-semibold">{props.countryInfo.name}</p><p className="truncate text-[11px] text-muted-foreground">{props.countryInfo.region} · {props.countryInfo.timezone} · {props.countryInfo.currency}</p></div></div><Badge variant="outline" className="shrink-0 text-[11px]">{props.filteredHolidays.length} 个节假日</Badge></div>}
    {props.selectedYearNumber >= 2027 && <div className="flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-700"><Info className="mt-0.5 h-3 w-3 shrink-0" />{props.selectedYear} 年为按规则推算的预测数据（不含农历/宗教历等无法推算的节日），实际安排以各国官方公布为准</div>}
    <div className="grid max-h-[520px] gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">{props.filteredHolidays.length > 0 ? props.filteredHolidays.map((holiday, index) => <HolidayCard key={index} holiday={holiday} />) : <div className="col-span-full flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-6 text-xs text-muted-foreground"><AlertCircle className="h-3.5 w-3.5" />该国家在{props.selectedYear}年{props.selectedMonth !== 'all' ? `${props.selectedMonth}月` : ''}暂无节假日数据</div>}</div>
  </div>
}

function SelectField({ id, label, value, onChange, children }: { id: string; label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) { return <div className="min-w-0"><Label htmlFor={id} className="mb-1 block text-[11px] text-muted-foreground">{label}</Label><Select value={value} onValueChange={onChange}><SelectTrigger id={id} className="h-8 text-[13px]"><SelectValue /></SelectTrigger><SelectContent>{children}</SelectContent></Select></div> }

function HolidayCard({ holiday }: { holiday: Holiday }) {
  const formattedDate = formatCalendarDateKey(holiday.date, { month: '2-digit', day: '2-digit' })
  const weekday = formatCalendarDateKey(holiday.date, { weekday: 'short' })
  const impactTone = holiday.impact === 'high'
    ? 'bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-300'
    : holiday.impact === 'medium'
      ? 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300'
      : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'

  return <div className="rounded-lg border px-2 py-1.5 transition-colors hover:bg-muted/40">
    <div className="flex items-start justify-between gap-1.5">
      <p className="min-w-0 truncate text-[12px] font-medium" title={holiday.name}>{holiday.name}</p>
      <Badge variant={holiday.type === 'public' ? 'default' : 'secondary'} className="shrink-0 px-1 text-[10px]">{getHolidayTypeName(holiday.type)}</Badge>
    </div>
    <p className="truncate text-[10px] text-muted-foreground" title={holiday.nameCN || holiday.localName}>{holiday.nameCN || holiday.localName || '—'}</p>
    <div className="mt-1 flex items-center justify-between gap-1 text-[11px] text-muted-foreground">
      <span className="truncate"><Calendar className="mr-0.5 inline h-3 w-3" />{formattedDate} {weekday}</span>
      <span className={`shrink-0 rounded px-1 py-px text-[10px] ${impactTone}`}>{getImpactLevelName(holiday.impact)}影响</span>
    </div>
  </div>
}
