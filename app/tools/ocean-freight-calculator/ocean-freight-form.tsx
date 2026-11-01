// 名称: 海运费用表单（紧凑版）
// 描述: 单屏布局下的参数区：运输方式、快捷模板与费用字段
// 路径: ExportBox/app/tools/ocean-freight-calculator/ocean-freight-form.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import { Info } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import type { OceanFreightMode } from '@/lib/tools/ocean-freight-calculator'
import { OCEAN_PRESETS, type FormState, type NumericField } from './ocean-freight-page-data'

interface OceanFreightFormProps {
  form: FormState
  summaryText: string
  onFieldChange: (field: NumericField, value: string) => void
  onModeChange: (mode: OceanFreightMode) => void
  onPreset: (values: Partial<FormState>) => void
}

const panelClass =
  'rounded-xl border border-slate-200 bg-card p-2.5 shadow-xs dark:border-white/10'

export function OceanFreightForm(props: OceanFreightFormProps) {
  return (
    <div className={panelClass}>
      {/* 第一行：运输方式 + 快捷模板 + 复制摘要 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Tabs value={props.form.mode} onValueChange={(value) => props.onModeChange(value as OceanFreightMode)}>
            <TabsList className="h-7">
              <TabsTrigger value="fcl" className="h-5 px-2.5 text-xs">整柜 FCL</TabsTrigger>
              <TabsTrigger value="lcl" className="h-5 px-2.5 text-xs">拼箱 LCL</TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="mx-0.5 h-4 w-px bg-slate-200 dark:bg-white/10" />
          {OCEAN_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => props.onPreset(preset.values)}
              className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-white/15 dark:text-slate-300 dark:hover:border-blue-300/40 dark:hover:bg-blue-400/10"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <EnhancedCopyButton text={props.summaryText} variant="outline" size="sm" className="h-7 px-2.5 text-xs">
          复制摘要
        </EnhancedCopyButton>
      </div>

      {/* 货量与柜型 */}
      <div className="mt-2 grid grid-cols-2 gap-x-2.5 gap-y-1.5 sm:grid-cols-4">
        <MiniField field="quantity" label="货物数量" suffix="件" step="1" value={props.form.quantity} onValueChange={props.onFieldChange} />
        <MiniField field="totalCbm" label="总体积" suffix="CBM" value={props.form.totalCbm} onValueChange={props.onFieldChange} />
        <MiniField field="totalWeightKg" label="总毛重" suffix="kg" value={props.form.totalWeightKg} onValueChange={props.onFieldChange} />
        {props.form.mode === 'fcl'
          ? <MiniField field="containerCount" label="柜数" suffix="柜" step="1" value={props.form.containerCount} onValueChange={props.onFieldChange} />
          : <MiniField field="minChargeableCbm" label="最低计费" suffix="CBM" value={props.form.minChargeableCbm} onValueChange={props.onFieldChange} />}
      </div>

      {/* 海运与港杂 */}
      <div className="mt-2 border-t pt-2">
        <p className="mb-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">海运与两港费用</p>
        <div className="grid grid-cols-3 gap-x-2.5 gap-y-1.5">
          <MiniField field="oceanFreightForeign" label="海运费合计" suffix="USD" value={props.form.oceanFreightForeign} onValueChange={props.onFieldChange} />
          <MiniField field="destinationChargeForeign" label="目的港费用" suffix="USD" value={props.form.destinationChargeForeign} onValueChange={props.onFieldChange} />
          <MiniField field="exchangeRate" label="美元汇率" suffix="CNY" step="0.0001" value={props.form.exchangeRate} onValueChange={props.onFieldChange} />
          <MiniField field="originChargesCny" label="起运港杂费" suffix="CNY" value={props.form.originChargesCny} onValueChange={props.onFieldChange} />
          <MiniField field="truckingFeeCny" label="拖车/内陆" suffix="CNY" value={props.form.truckingFeeCny} onValueChange={props.onFieldChange} />
          <MiniField field="customsFeeCny" label="报关费用" suffix="CNY" value={props.form.customsFeeCny} onValueChange={props.onFieldChange} />
          <MiniField field="documentFeeCny" label="文件/操作费" suffix="CNY" value={props.form.documentFeeCny} onValueChange={props.onFieldChange} />
          <MiniField field="cargoValueCny" label="货值" suffix="CNY" value={props.form.cargoValueCny} onValueChange={props.onFieldChange} />
          <MiniField field="insuranceRatePercent" label="保险费率" suffix="%" value={props.form.insuranceRatePercent} onValueChange={props.onFieldChange} />
        </div>
      </div>

      <p className="mt-2 flex items-start gap-1.5 border-t pt-1.5 text-[10px] leading-3.5 text-muted-foreground">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        结果用于报价前快速拆分成本，未包含查验、滞港、甩柜、仓储、超重和特殊品名附加费。
      </p>
    </div>
  )
}

interface MiniFieldProps {
  field: NumericField
  label: string
  suffix: string
  value: string
  onValueChange: (field: NumericField, value: string) => void
  step?: string
}

function MiniField({ field, label, suffix, value, onValueChange, step = '0.01' }: MiniFieldProps) {
  return (
    <label htmlFor={field} className="block min-w-0">
      <span className="mb-1 block truncate text-[11px] leading-3 text-slate-600 dark:text-slate-300" title={label}>
        {label}
      </span>
      <span className="relative block">
        <input
          id={field}
          type="text"
          inputMode={step === '1' ? 'numeric' : 'decimal'}
          pattern="[0-9]*[.]?[0-9]*"
          value={value}
          onChange={(event) => onValueChange(field, event.target.value)}
          className="h-8 w-full rounded-md border border-slate-200 bg-white pr-10 pl-2 text-[13px] font-medium tabular-nums text-slate-900 outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15 dark:border-white/15 dark:bg-slate-900 dark:text-white"
        />
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400">{suffix}</span>
      </span>
    </label>
  )
}
