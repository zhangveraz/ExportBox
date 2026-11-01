// 名称: 进口成本表单（对齐出口退税布局）
// 描述: 三段式密集录参：基础参数 / 外币费用 / 税费与本地费用，1080p 下一屏可录入完整
// 路径: ExportBox/app/tools/import-landed-cost-calculator/import-cost-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Calculator, Info, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { ScenarioPresets } from '@/components/tools/scenario-presets'
import type { ImportCurrency } from '@/lib/tools/import-landed-cost-calculator'
import { CURRENCY_OPTIONS, IMPORT_PRESETS, type FormState, type NumericField } from './import-cost-page-data'

interface ImportCostFormProps {
  form: FormState
  onFieldChange: (field: NumericField, value: string) => void
  onCurrencyChange: (currency: ImportCurrency, rate: string) => void
  onPreset: (values: Partial<FormState>) => void
  onReset: () => void
  summaryText: string
}

export function ImportCostForm(props: ImportCostFormProps) {
  const currency = props.form.currency

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-3 pt-2.5 pb-1">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-1.5 text-[13px] font-semibold">
              <Calculator className="h-4 w-4" />
              到岸成本参数
            </CardTitle>
            <p className="text-[10px] leading-3 text-muted-foreground">外币费用按所选币种录入，税费与本地费用按人民币录入</p>
          </div>
          <Button variant="outline" size="sm" className="h-7 shrink-0 px-2 text-[11px]" onClick={props.onReset}>
            <RotateCcw className="mr-1 h-3 w-3" />
            重置
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 px-3 pt-0 pb-2.5">
        <ScenarioPresets presets={IMPORT_PRESETS} onSelect={props.onPreset} />

        <section>
          <h3 className="mb-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200">基础参数</h3>
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5 md:grid-cols-4">
            <div className="space-y-1">
              <Label htmlFor="currency" className="text-[11px] leading-3 text-slate-600 dark:text-slate-300">采购币种</Label>
              <Select
                value={props.form.currency}
                onValueChange={(value) => {
                  const selected = CURRENCY_OPTIONS.find((option) => option.value === value)
                  props.onCurrencyChange(value as ImportCurrency, selected?.rate ?? props.form.exchangeRate)
                }}
              >
                <SelectTrigger id="currency" className="h-8 w-full min-w-0 text-[13px]">
                  <SelectValue placeholder="选择币种" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <MiniField field="quantity" label="进口数量" suffix="件" value={props.form.quantity} onValueChange={props.onFieldChange} />
            <MiniField field="exchangeRate" label="折算汇率" suffix="CNY" value={props.form.exchangeRate} onValueChange={props.onFieldChange} />
            <MiniField field="targetSellingPriceCny" label="目标销售单价" suffix="CNY" value={props.form.targetSellingPriceCny} onValueChange={props.onFieldChange} />
          </div>
        </section>

        <section>
          <h3 className="mb-1 flex items-baseline gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
            外币费用
            <span className="text-[10px] font-normal text-muted-foreground">{currency}</span>
          </h3>
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5 md:grid-cols-4">
            <MiniField field="unitPriceForeign" label="外币单价" suffix={currency} value={props.form.unitPriceForeign} onValueChange={props.onFieldChange} />
            <MiniField field="internationalFreightForeign" label="国际运费" suffix={currency} value={props.form.internationalFreightForeign} onValueChange={props.onFieldChange} />
            <MiniField field="insuranceForeign" label="保险费" suffix={currency} value={props.form.insuranceForeign} onValueChange={props.onFieldChange} />
            <MiniField field="otherForeignCost" label="其他外币费用" suffix={currency} value={props.form.otherForeignCost} onValueChange={props.onFieldChange} />
          </div>
        </section>

        <section>
          <h3 className="mb-1 flex items-baseline gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
            税费与本地费用
            <span className="text-[10px] font-normal text-muted-foreground">CNY</span>
          </h3>
          <div className="grid grid-cols-3 gap-x-2.5 gap-y-1.5 md:grid-cols-4 xl:grid-cols-6">
            <MiniField field="dutyRatePercent" label="进口关税率" suffix="%" value={props.form.dutyRatePercent} onValueChange={props.onFieldChange} />
            <MiniField field="vatRatePercent" label="增值税率" suffix="%" value={props.form.vatRatePercent} onValueChange={props.onFieldChange} />
            <MiniField field="customsFeeCny" label="报关/清关费" suffix="CNY" value={props.form.customsFeeCny} onValueChange={props.onFieldChange} />
            <MiniField field="portChargeCny" label="港杂/查验费" suffix="CNY" value={props.form.portChargeCny} onValueChange={props.onFieldChange} />
            <MiniField field="domesticFreightCny" label="国内运输费" suffix="CNY" value={props.form.domesticFreightCny} onValueChange={props.onFieldChange} />
            <MiniField field="otherLocalCostCny" label="其他本地费用" suffix="CNY" value={props.form.otherLocalCostCny} onValueChange={props.onFieldChange} />
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-1.5">
          <p className="flex max-w-[64%] items-start gap-1.5 text-[10px] leading-3.5 text-muted-foreground">
            <Info className="mt-px h-3 w-3 shrink-0" />
            用于报价与预算测算，实际税费以报关单、税则归类与财务口径为准。
          </p>
          <EnhancedCopyButton text={props.summaryText} variant="outline" size="sm" className="h-7 px-2 text-[11px]">
            复制摘要
          </EnhancedCopyButton>
        </div>
      </CardContent>
    </Card>
  )
}

interface MiniFieldProps {
  field: NumericField
  label: string
  suffix: string
  value: string
  onValueChange: (field: NumericField, value: string) => void
}

function MiniField({ field, label, suffix, value, onValueChange }: MiniFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={field} className="truncate text-[11px] leading-3 text-slate-600 dark:text-slate-300" title={label}>{label}</Label>
      <div className="relative">
        <Input
          id={field}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onValueChange(field, event.target.value)}
          className="h-8 pr-11 text-[13px] tabular-nums"
        />
        <span className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-[10px] text-muted-foreground">{suffix}</span>
      </div>
    </div>
  )
}
