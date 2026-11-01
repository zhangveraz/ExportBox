// 名称: 外贸汇率敏感性分析表单
// 描述: 展示外币订单、CNY 成本、基准汇率与升贬值情景参数（紧凑版）
// 路径: ExportBox/app/tools/fx-sensitivity-calculator/fx-sensitivity-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { RefreshCw, TrendingUp } from 'lucide-react'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormattedInput } from '@/components/ui/formatted-input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FX_CURRENCY_PRESETS, type FxCurrency } from '@/lib/tools/fx-sensitivity-calculator'
import type { FxSensitivityFormState, NumericField } from './fx-sensitivity-page-data'

interface FxSensitivityFormProps {
  form: FxSensitivityFormState
  summaryText: string
  onCurrencyChange: (currency: FxCurrency) => void
  onFieldChange: (field: NumericField, value: string) => void
  onReset: () => void
}

export function FxSensitivityForm({ form, summaryText, onCurrencyChange, onFieldChange, onReset }: FxSensitivityFormProps) {
  const rateUnit = FX_CURRENCY_PRESETS.find((item) => item.value === form.currency)?.unit ?? 1
  const rateSuffix = `CNY/${rateUnit === 1 ? form.currency : `${rateUnit} ${form.currency}`}`
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-3 pt-3 pb-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><TrendingUp className="h-4 w-4" />汇率与成本参数</CardTitle>
            <p className="text-[10px] text-muted-foreground">统一用 CNY 成本口径，输入报价币种的基准结算汇率</p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <EnhancedCopyButton text={summaryText} variant="outline" size="sm" className="h-7 px-2 text-[11px]" disabled={!summaryText}>复制摘要</EnhancedCopyButton>
            <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={onReset}><RefreshCw className="mr-1 h-3 w-3" />重置</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 sm:grid-cols-3">
          <div className="space-y-1"><Label htmlFor="fx-currency" className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">报价币种</Label><Select value={form.currency} onValueChange={(value) => onCurrencyChange(value as FxCurrency)}><SelectTrigger id="fx-currency" className="h-8 text-[13px]"><SelectValue /></SelectTrigger><SelectContent>{FX_CURRENCY_PRESETS.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
          <NumberField id="fx-foreign-amount" label="外币订单金额" suffix={form.currency} value={form.foreignAmount} onChange={(value) => onFieldChange('foreignAmount', value)} autoFocus />
          <NumberField id="fx-cost-cny" label="订单成本" suffix="CNY" value={form.costCny} onChange={(value) => onFieldChange('costCny', value)} />
          <NumberField id="fx-other-cost-cny" label="其他 CNY 费用" suffix="CNY" value={form.otherCostCny} onChange={(value) => onFieldChange('otherCostCny', value)} />
          <NumberField id="fx-fee-percent" label="收款手续费率" suffix="%" value={form.settlementFeePercent} onChange={(value) => onFieldChange('settlementFeePercent', value)} />
          <NumberField id="fx-base-rate" label="基准汇率" suffix={rateSuffix} value={form.baseRate} onChange={(value) => onFieldChange('baseRate', value)} />
          <NumberField id="fx-appreciation" label="人民币升值幅度" suffix="%" value={form.rmbAppreciationPercent} onChange={(value) => onFieldChange('rmbAppreciationPercent', value)} />
          <NumberField id="fx-depreciation" label="人民币贬值幅度" suffix="%" value={form.rmbDepreciationPercent} onChange={(value) => onFieldChange('rmbDepreciationPercent', value)} />
        </div>
        <p className="text-[10px] leading-4 text-muted-foreground">波动情景说明：升值会降低每单位外币可兑换的 CNY，贬值会提高可兑换的 CNY。</p>
      </CardContent>
    </Card>
  )
}

function NumberField({ id, label, suffix, value, onChange, autoFocus = false }: { id: string; label: string; suffix: string; value: string; onChange: (value: string) => void; autoFocus?: boolean }) {
  return <div className="space-y-1"><Label htmlFor={id} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">{label}</Label><div className="relative"><FormattedInput id={id} value={value} onChange={onChange} format="decimal" maxDecimals={4} autoFocusFirst={autoFocus} className="h-8 pr-20 text-[13px] font-medium" /><span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">{suffix}</span></div></div>
}
