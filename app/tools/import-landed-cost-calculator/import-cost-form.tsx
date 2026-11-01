// 名称: 进口成本表单（紧凑版）
// 描述: 单屏布局下的参数区：币种、采购、税费与本地费用
// 路径: ExportBox/app/tools/import-landed-cost-calculator/import-cost-form.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import { Info } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import type { ImportCurrency } from '@/lib/tools/import-landed-cost-calculator'
import { CURRENCY_OPTIONS, IMPORT_PRESETS, type FormState, type NumericField } from './import-cost-page-data'

interface ImportCostFormProps {
  form: FormState
  goodsValue: string
  foreignCostTotal: string
  onFieldChange: (field: NumericField, value: string) => void
  onCurrencyChange: (currency: ImportCurrency, rate: string) => void
  onPreset: (values: Partial<FormState>) => void
  summaryText: string
}

const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

export function ImportCostForm(props: ImportCostFormProps) {
  return (
    <div className={panelClass}>
      {/* 第一行：快捷预设 + 复制摘要 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">快捷预设</span>
          {IMPORT_PRESETS.map((preset) => (
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

      {/* 币种与数量 */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <label htmlFor="currency" className="block min-w-0">
          <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">采购币种</span>
          <Select
            value={props.form.currency}
            onValueChange={(value) => {
              const selected = CURRENCY_OPTIONS.find((option) => option.value === value)
              props.onCurrencyChange(value as ImportCurrency, selected?.rate ?? props.form.exchangeRate)
            }}
          >
            <SelectTrigger id="currency" className="h-8 px-2 text-[13px]">
              <SelectValue placeholder="选择币种" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <MiniField field="quantity" label="进口数量" suffix="件" step="1" value={props.form.quantity} onValueChange={props.onFieldChange} />
        <MiniField field="exchangeRate" label="折算汇率" suffix="CNY" step="0.0001" value={props.form.exchangeRate} onValueChange={props.onFieldChange} />
      </div>

      {/* 外币费用 */}
      <p className="mt-3 mb-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">外币费用（{props.form.currency}）</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniField field="unitPriceForeign" label="外币单价" suffix={props.form.currency} value={props.form.unitPriceForeign} onValueChange={props.onFieldChange} />
        <MiniField field="internationalFreightForeign" label="国际运费" suffix={props.form.currency} value={props.form.internationalFreightForeign} onValueChange={props.onFieldChange} />
        <MiniField field="insuranceForeign" label="保险费" suffix={props.form.currency} value={props.form.insuranceForeign} onValueChange={props.onFieldChange} />
        <MiniField field="otherForeignCost" label="其他外币费用" suffix={props.form.currency} value={props.form.otherForeignCost} onValueChange={props.onFieldChange} />
      </div>

      {/* 税费与本地费用 */}
      <p className="mt-3 mb-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">税费与本地费用（CNY）</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <MiniField field="dutyRatePercent" label="进口关税率" suffix="%" value={props.form.dutyRatePercent} onValueChange={props.onFieldChange} />
        <MiniField field="vatRatePercent" label="进口增值税率" suffix="%" value={props.form.vatRatePercent} onValueChange={props.onFieldChange} />
        <MiniField field="customsFeeCny" label="报关/清关费" suffix="CNY" value={props.form.customsFeeCny} onValueChange={props.onFieldChange} />
        <MiniField field="portChargeCny" label="港杂/查验费" suffix="CNY" value={props.form.portChargeCny} onValueChange={props.onFieldChange} />
        <MiniField field="domesticFreightCny" label="国内运输费" suffix="CNY" value={props.form.domesticFreightCny} onValueChange={props.onFieldChange} />
        <MiniField field="otherLocalCostCny" label="其他本地费用" suffix="CNY" value={props.form.otherLocalCostCny} onValueChange={props.onFieldChange} />
      </div>

      {/* 目标售价 + 货值小结 */}
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-white/10">
        <MiniField field="targetSellingPriceCny" label="目标销售单价" suffix="CNY" value={props.form.targetSellingPriceCny} onValueChange={props.onFieldChange} />
        <div className="rounded-lg bg-slate-50 px-2.5 py-1.5 dark:bg-white/5">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">采购货值</p>
          <p className="truncate text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">{props.goodsValue}</p>
          <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">外币费用合计 {props.foreignCostTotal}</p>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        结果用于报价和预算测算，实际税费以报关单、税则归类、进口环节税单和财务口径为准。
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
      <span className="mb-1 block truncate text-[11px] text-slate-500 dark:text-slate-400" title={label}>
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
          className="h-8 w-full rounded-md border border-slate-200 bg-white pl-2 pr-11 text-[13px] font-medium tabular-nums text-slate-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-white/15 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400/60 dark:focus:ring-blue-400/20"
        />
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400">{suffix}</span>
      </span>
    </label>
  )
}
