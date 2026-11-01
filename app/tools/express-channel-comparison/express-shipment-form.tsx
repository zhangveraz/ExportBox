// 名称: 快递专线货物表单（紧凑版）
// 描述: 单屏布局下的货物区：货物属性、目的地、箱规与毛净重
// 路径: ExportBox/app/tools/express-channel-comparison/express-shipment-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Info, MapPin, PackageSearch } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  CARGO_TYPE_OPTIONS,
  type CargoType,
  type ShipmentForm,
  type ShipmentNumericField,
  type ShipmentTextField,
} from './express-comparison-page-data'

interface ExpressShipmentFormProps {
  form: ShipmentForm
  onTextChange: (field: ShipmentTextField, value: string) => void
  onNumericChange: (field: ShipmentNumericField, value: string) => void
  onCargoTypeChange: (value: CargoType) => void
}

const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

export function ExpressShipmentForm(props: ExpressShipmentFormProps) {
  const cargoNeedsReview = props.form.cargoType !== 'general'

  return (
    <div className={panelClass}>
      <div className="flex items-center gap-1.5">
        <PackageSearch className="h-4 w-4 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">货物与目的地</h2>
      </div>

      {/* 品名 + 目的地 */}
      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
        <label htmlFor="cargoName" className="block min-w-0">
          <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">货物名称</span>
          <Input
            id="cargoName"
            value={props.form.cargoName}
            onChange={(event) => props.onTextChange('cargoName', event.target.value)}
            className="h-8 text-[13px]"
          />
        </label>
        <label htmlFor="destination" className="block min-w-0">
          <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">目的地</span>
          <span className="relative block">
            <MapPin className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              id="destination"
              value={props.form.destination}
              onChange={(event) => props.onTextChange('destination', event.target.value)}
              className="h-8 pl-7 text-[13px]"
            />
          </span>
        </label>
      </div>

      {/* 货物属性：四个按钮点选，比下拉快 */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-slate-400 dark:text-slate-500">货物属性</span>
        {CARGO_TYPE_OPTIONS.map((option) => {
          const active = props.form.cargoType === option.value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => props.onCargoTypeChange(option.value as CargoType)}
              className={cn(
                'rounded-md border px-2 py-1 text-[11px] transition-colors',
                active
                  ? 'border-blue-600 bg-blue-600 font-medium text-white'
                  : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-white/15 dark:text-slate-300'
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {/* 箱规与重量 */}
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-white/10">
        <MiniField field="lengthCm" label="外箱长 cm" value={props.form.lengthCm} onChange={props.onNumericChange} />
        <MiniField field="widthCm" label="外箱宽 cm" value={props.form.widthCm} onChange={props.onNumericChange} />
        <MiniField field="heightCm" label="外箱高 cm" value={props.form.heightCm} onChange={props.onNumericChange} />
        <MiniField field="grossWeightKg" label="单箱毛重 kg" value={props.form.grossWeightKg} onChange={props.onNumericChange} />
        <MiniField field="netWeightKg" label="单箱净重 kg" value={props.form.netWeightKg} onChange={props.onNumericChange} />
        <MiniField field="packageCount" label="箱数 箱" value={props.form.packageCount} onChange={props.onNumericChange} />
      </div>

      {cargoNeedsReview && (
        <p className="mt-2.5 flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          膏体、液体、粉末或带电货物需先确认渠道承运要求、鉴定资料及附加费。
        </p>
      )}
    </div>
  )
}

function MiniField({
  field,
  label,
  value,
  onChange,
}: {
  field: ShipmentNumericField
  label: string
  value: string
  onChange: (field: ShipmentNumericField, value: string) => void
}) {
  return (
    <label htmlFor={field} className="block min-w-0">
      <span className="mb-1 block truncate text-[11px] text-slate-500 dark:text-slate-400" title={label}>
        {label}
      </span>
      <Input
        id={field}
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
        className="h-8 text-[13px] font-medium tabular-nums"
      />
    </label>
  )
}
