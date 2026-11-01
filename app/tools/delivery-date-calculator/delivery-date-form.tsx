// 名称: 交期计算表单
// 描述: 单屏紧凑版交期参数表单，含起始日期、阶段天数、日期口径与节假日选项
// 路径: ExportBox/app/tools/delivery-date-calculator/delivery-date-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { RotateCcw } from 'lucide-react'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DELIVERY_COUNTRIES, type DeliveryDayMode } from '@/lib/tools/delivery-date-calculator'
import { ScenarioPresets } from '@/components/tools/scenario-presets'
import { DELIVERY_PRESETS, type DayField, type DeliveryDateFormState } from './delivery-date-page-data'

interface DeliveryDateFormProps {
  form: DeliveryDateFormState
  copyText: string
  canCopy: boolean
  onStartDate: (value: string) => void
  onDayField: (field: DayField, value: string) => void
  onMode: (value: DeliveryDayMode) => void
  onHolidayToggle: () => void
  onCountry: (value: string) => void
  onPreset: (values: Partial<DeliveryDateFormState>) => void
  onReset: () => void
}

const LABEL = 'text-[11px] font-medium leading-4'

export function DeliveryDateForm(props: DeliveryDateFormProps) {
  const holidaysEnabled = props.form.dayMode === 'business'
  return (
    <Card>
      <CardHeader className="px-3 pt-2.5 pb-1.5">
        <CardTitle className="text-sm font-semibold">交期参数</CardTitle>
        <p className="truncate text-[10px] leading-4 text-muted-foreground">起始日不计入天数，生产 / 运输 / 缓冲三个阶段依次累加</p>
      </CardHeader>
      <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <Label htmlFor="startDate" className={LABEL}>起始日期</Label>
            <Input id="startDate" type="date" value={props.form.startDate} onChange={(event) => props.onStartDate(event.target.value)} className="h-8 font-mono text-[12px]" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dayMode" className={LABEL}>计算口径</Label>
            <Select value={props.form.dayMode} onValueChange={(value) => props.onMode(value as DeliveryDayMode)}>
              <SelectTrigger id="dayMode" className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="calendar">自然日</SelectItem>
                <SelectItem value="business">工作日（排除周末）</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <DayInput field="productionDays" label="生产周期" value={props.form.productionDays} onChange={props.onDayField} />
          <DayInput field="transitDays" label="运输周期" value={props.form.transitDays} onChange={props.onDayField} />
          <DayInput field="bufferDays" label="缓冲时间" value={props.form.bufferDays} onChange={props.onDayField} />
        </div>
        <ScenarioPresets presets={DELIVERY_PRESETS} onSelect={props.onPreset} />
        <div className="rounded-md border px-2.5 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium leading-4">排除法定公共假日<span className="ml-1 font-normal text-muted-foreground">（仅工作日模式，覆盖 2026–2030）</span></p>
            <Button type="button" size="sm" variant={props.form.excludeHolidays ? 'default' : 'outline'} disabled={!holidaysEnabled} aria-pressed={props.form.excludeHolidays} onClick={props.onHolidayToggle} className="h-6 shrink-0 px-2 text-[11px]">{props.form.excludeHolidays ? '已启用' : '未启用'}</Button>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="shrink-0 text-[11px] text-muted-foreground">国家/地区</span>
            <Select value={props.form.countryCode} onValueChange={props.onCountry} disabled={!holidaysEnabled || !props.form.excludeHolidays}>
              <SelectTrigger id="holidayCountry" className="h-7 flex-1 text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>{DELIVERY_COUNTRIES.map((country) => <SelectItem key={country.code} value={country.code}>{country.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-[10px] leading-4 text-muted-foreground">工作日口径统一应用于三个阶段；实际交期仍应结合供应商排产、船期和清关安排确认。</p>
        <div className="flex flex-wrap gap-2">
          <EnhancedCopyButton text={props.copyText} disabled={!props.canCopy} className="h-7 px-2 text-[11px]">复制英文摘要</EnhancedCopyButton>
          <Button type="button" variant="outline" size="sm" onClick={props.onReset} className="h-7 px-2 text-[11px]"><RotateCcw className="mr-1 h-3 w-3" />重置</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function DayInput({ field, label, value, onChange }: { field: DayField; label: string; value: string; onChange: (field: DayField, value: string) => void }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={field} className={LABEL}>{label}</Label>
      <div className="relative">
        <Input id={field} type="text" inputMode="numeric" pattern="[0-9]*" value={value} onChange={(event) => onChange(field, event.target.value)} className="h-8 pr-7 text-[12px] tabular-nums" />
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">天</span>
      </div>
    </div>
  )
}
