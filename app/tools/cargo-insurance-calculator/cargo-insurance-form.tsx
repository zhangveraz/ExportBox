// 名称: 货物保险费计算表单
// 描述: 采集价格条款、货值、运费、投保加成与费率参数（紧凑版）
// 路径: ExportBox/app/tools/cargo-insurance-calculator/cargo-insurance-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { RefreshCw, Umbrella } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormattedInput } from '@/components/ui/formatted-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INSURANCE_PRESETS, type InsurancePresetId, type InsurancePriceBasis } from '@/lib/tools/cargo-insurance-calculator'

export interface InsuranceFormState {
  priceBasis: InsurancePriceBasis
  currency: string
  amount: string
  freightAmount: string
  markupPercent: string
  premiumRatePercent: string
  warRiskRatePercent: string
}

export type InsuranceNumericField = 'amount' | 'freightAmount' | 'markupPercent' | 'premiumRatePercent' | 'warRiskRatePercent'

export interface CargoInsuranceFormProps {
  form: InsuranceFormState
  onNumericChange: (field: InsuranceNumericField, value: string) => void
  onBasisChange: (basis: InsurancePriceBasis) => void
  onCurrencyChange: (currency: string) => void
  onApplyPreset: (presetId: InsurancePresetId) => void
  onReset: () => void
}

const PRICE_BASIS_OPTIONS: Array<{ value: InsurancePriceBasis; label: string }> = [
  { value: 'FOB', label: 'FOB（需填海运费）' },
  { value: 'CFR', label: 'CFR（含运费不含保费）' },
  { value: 'CIF', label: 'CIF（含保费直保）' },
]

export function CargoInsuranceForm({ form, onNumericChange, onBasisChange, onCurrencyChange, onApplyPreset, onReset }: CargoInsuranceFormProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-3 pt-3 pb-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><Umbrella className="h-4 w-4" />投保参数</CardTitle>
            <p className="text-[10px] text-muted-foreground">按贸易术语口径换算 CIF 并计算保费</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="h-7 shrink-0 px-2 text-[11px]" onClick={onReset}>
            <RefreshCw className="mr-1 h-3 w-3" />重置
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
        <div className="space-y-1">
          <Label className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">常用场景预设</Label>
          <div className="flex flex-wrap gap-1.5">
            {INSURANCE_PRESETS.map((preset) => (
              <Button key={preset.id} type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]" title={preset.description} onClick={() => onApplyPreset(preset.id)}>
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="priceBasis" className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">价格条款</Label>
            <Select value={form.priceBasis} onValueChange={(value) => onBasisChange(value as InsurancePriceBasis)}>
              <SelectTrigger id="priceBasis" className="h-8 text-[13px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRICE_BASIS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="currency" className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">币种</Label>
            <Input id="currency" value={form.currency} onChange={(event) => onCurrencyChange(event.target.value)} className="h-8 text-[13px] font-medium" placeholder="USD" maxLength={8} />
          </div>
          <NumberField
            id="amount"
            label={form.priceBasis === 'CIF' ? 'CIF 货值' : `${form.priceBasis} 货值`}
            suffix={form.currency.trim().toUpperCase() || 'USD'}
            value={form.amount}
            onChange={(value) => onNumericChange('amount', value)}
            autoFocus
          />
          <NumberField
            id="freightAmount"
            label="海运费"
            suffix={form.currency.trim().toUpperCase() || 'USD'}
            value={form.freightAmount}
            onChange={(value) => onNumericChange('freightAmount', value)}
            disabled={form.priceBasis !== 'FOB'}
          />
          <NumberField id="markupPercent" label="投保加成" suffix="%" value={form.markupPercent} onChange={(value) => onNumericChange('markupPercent', value)} />
          <NumberField id="premiumRatePercent" label="基本险费率" suffix="%" value={form.premiumRatePercent} onChange={(value) => onNumericChange('premiumRatePercent', value)} />
          <NumberField id="warRiskRatePercent" label="战争险附加费率" suffix="%" value={form.warRiskRatePercent} onChange={(value) => onNumericChange('warRiskRatePercent', value)} />
        </div>
        <p className="text-[10px] leading-4 text-muted-foreground">费率填写百分数数值，例如 0.08% 的费率填 0.08。投保加成 10 表示按 CIF 的 110% 投保。</p>
      </CardContent>
    </Card>
  )
}

interface NumberFieldProps {
  id: string
  label: string
  suffix: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  autoFocus?: boolean
}

function NumberField({ id, label, suffix, value, onChange, disabled = false, autoFocus = false }: NumberFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">{label}</Label>
      <div className="relative">
        <FormattedInput
          id={id}
          value={value}
          onChange={onChange}
          format="decimal"
          maxDecimals={4}
          disabled={disabled}
          autoFocusFirst={autoFocus}
          className="h-8 pr-16 text-[13px] font-medium"
        />
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">{suffix}</span>
      </div>
    </div>
  )
}
