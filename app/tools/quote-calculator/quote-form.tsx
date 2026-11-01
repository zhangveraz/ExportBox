// 名称: 外贸报价表单（紧凑版）
// 描述: 单屏布局下的参数区：条款、快捷场景、成本字段与币种
// 路径: ExportBox/app/tools/quote-calculator/quote-form.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import { Info } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { QUOTE_TERM_CONFIGS, QUOTE_TERM_OPTIONS, type QuoteMode, type QuoteTerm } from '@/lib/tools/quote-calculator'
import { CURRENCY_OPTIONS, SCENARIO_PRESETS, type FormState, type NumericField, type QuoteCurrency } from './quote-page-data'

interface QuoteFormProps {
  form: FormState
  mode: QuoteMode
  missingCostLabels: string[]
  onFieldChange: (field: NumericField, value: string) => void
  onModeChange: (mode: QuoteMode) => void
  onTermChange: (term: QuoteTerm) => void
  onCurrencyChange: (currency: QuoteCurrency, rate: string) => void
  onPreset: (values: Partial<FormState>, mode: QuoteMode) => void
}

/** 卡片外壳：统一边框、圆角与内边距 */
const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

export function QuoteForm(props: QuoteFormProps) {
  const term = QUOTE_TERM_CONFIGS[props.form.quoteTerm]
  const isTargetMode = props.mode === 'target-margin'

  return (
    <div className={panelClass}>
      {/* 第一行：计算方式 + 快捷场景 + 重置 */}
      <div className="flex flex-wrap items-center gap-2">
        <Tabs value={props.mode} onValueChange={(value) => props.onModeChange(value as QuoteMode)}>
          <TabsList className="h-8">
            <TabsTrigger value="target-margin" className="px-3 text-xs">
              按目标利润反推
            </TabsTrigger>
            <TabsTrigger value="known-price" className="px-3 text-xs">
              按已知售价核算
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap items-center gap-1.5">
          {SCENARIO_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => props.onPreset(preset.values, preset.mode)}
              className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-white/15 dark:text-slate-300 dark:hover:border-blue-300/40 dark:hover:bg-blue-400/10"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 第二行：贸易条款 + 口径说明 */}
      <div className="mt-3 flex items-center gap-2.5 rounded-lg bg-slate-50 px-2.5 py-2 dark:bg-white/5">
        <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">贸易条款</span>
        <Select value={props.form.quoteTerm} onValueChange={(value) => props.onTermChange(value as QuoteTerm)}>
          <SelectTrigger id="quoteTerm" className="h-7 w-[212px] shrink-0 bg-white px-2 text-xs dark:bg-slate-900">
            <SelectValue placeholder="选择贸易条款" />
          </SelectTrigger>
          <SelectContent>
            {QUOTE_TERM_OPTIONS.map((item) => (
              <SelectItem key={item.code} value={item.code}>
                {item.code} · {item.nameCn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="min-w-0 flex-1 truncate text-[11px] text-slate-500 dark:text-slate-400" title={term.note}>
          {term.note}
        </p>
      </div>

      {props.missingCostLabels.length > 0 && (
        <p className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-300">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          {props.form.quoteTerm} 条款还需补充 {props.missingCostLabels.join('、')}；不填也能算，但含运费的报价会偏低。
        </p>
      )}

      {/* 成本字段：两列紧凑排列 */}
      <div className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
        <NumberField field="unitCostCny" short="单件成本" label="单件采购成本" suffix="CNY" value={props.form.unitCostCny} onValueChange={props.onFieldChange} />
        <NumberField field="quantity" short="订单数量" label="订单数量" suffix="件" step="1" value={props.form.quantity} onValueChange={props.onFieldChange} />
        <NumberField field="domesticFeeCny" short="内陆费用" label="内陆/交货前费用" suffix="CNY" value={props.form.domesticFeeCny} onValueChange={props.onFieldChange} />
        <NumberField field="exportFeeCny" short="报关杂费" label="出口报关/起运港杂费" suffix="CNY" value={props.form.exportFeeCny} onValueChange={props.onFieldChange} />
        <NumberField field="internationalFreightCny" short="国际运费" label="国际运输费" suffix="CNY" value={props.form.internationalFreightCny} onValueChange={props.onFieldChange} />
        <NumberField field="insuranceFeeCny" short="运输保险" label="运输保险费" suffix="CNY" value={props.form.insuranceFeeCny} onValueChange={props.onFieldChange} />
        <NumberField field="destinationFeeCny" short="目的费用" label="目的地费用/派送" suffix="CNY" value={props.form.destinationFeeCny} onValueChange={props.onFieldChange} />
        <NumberField field="importDutyTaxCny" short="进口税费" label="进口清关税费" suffix="CNY" value={props.form.importDutyTaxCny} onValueChange={props.onFieldChange} />
        <NumberField field="rebatePercent" short="退税率" label="出口退税率" suffix="%" value={props.form.rebatePercent} onValueChange={props.onFieldChange} />
        <NumberField field="vatPercent" short="增值税" label="增值税率" suffix="%" value={props.form.vatPercent} onValueChange={props.onFieldChange} />
        <NumberField field="commissionPercent" short="佣金" label="佣金比例" suffix="%" value={props.form.commissionPercent} onValueChange={props.onFieldChange} />
        <NumberField field="paymentFeePercent" short="手续费" label="收款手续费" suffix="%" value={props.form.paymentFeePercent} onValueChange={props.onFieldChange} />
        {isTargetMode ? (
          <NumberField field="targetMarginPercent" short="目标利润" label="目标利润率" suffix="%" value={props.form.targetMarginPercent} onValueChange={props.onFieldChange} />
        ) : (
          <NumberField field="sellingPriceForeign" short="已知售价" label="已知销售单价" suffix={props.form.currency} value={props.form.sellingPriceForeign} onValueChange={props.onFieldChange} />
        )}
        <div className="flex items-center gap-2">
          <span className="w-[62px] shrink-0 text-xs text-slate-500 dark:text-slate-400">汇率</span>
          <RelativeInput field="exchangeRate" suffix="CNY" step="0.0001" value={props.form.exchangeRate} onValueChange={props.onFieldChange} />
        </div>
      </div>

      {/* 币种：和汇率同一行的语义分组 */}
      <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-white/10">
        <span className="w-[62px] shrink-0 text-xs text-slate-500 dark:text-slate-400">报价币种</span>
        <Select
          value={props.form.currency}
          onValueChange={(value) => {
            const selected = CURRENCY_OPTIONS.find((option) => option.value === value)
            props.onCurrencyChange(value as QuoteCurrency, selected?.rate ?? props.form.exchangeRate)
          }}
        >
          <SelectTrigger id="currency" className="h-8 w-[148px] px-2 text-xs">
            <SelectValue placeholder="选择报价币种" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">切换币种会自动带出参考汇率，可手动改</span>
      </div>
    </div>
  )
}

interface NumberFieldProps {
  field: NumericField
  /** 列表里显示的短名，鼠标悬停可看全称 */
  short: string
  label: string
  suffix?: string
  value: string
  onValueChange: (field: NumericField, value: string) => void
  step?: string
}

function NumberField({ field, short, label, suffix, value, onValueChange, step = '0.01' }: NumberFieldProps) {
  return (
    <label htmlFor={field} className="flex items-center gap-2" title={label}>
      <span className="w-[62px] shrink-0 truncate text-xs text-slate-500 dark:text-slate-400">{short}</span>
      <RelativeInput field={field} suffix={suffix} step={step} value={value} onValueChange={onValueChange} />
    </label>
  )
}

function RelativeInput({
  field,
  suffix,
  step = '0.01',
  value,
  onValueChange,
}: {
  field: NumericField
  suffix?: string
  step?: string
  value: string
  onValueChange: (field: NumericField, value: string) => void
}) {
  return (
    <span className="relative min-w-0 flex-1">
      <input
        id={field}
        type="text"
        inputMode={step === '1' ? 'numeric' : 'decimal'}
        pattern="[0-9]*[.]?[0-9]*"
        value={value}
        onChange={(event) => onValueChange(field, event.target.value)}
        className={cn(
          'h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[13px] font-medium tabular-nums text-slate-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-white/15 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400/60 dark:focus:ring-blue-400/20',
          suffix && 'pr-9',
        )}
      />
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400 dark:text-slate-500">
          {suffix}
        </span>
      )}
    </span>
  )
}
