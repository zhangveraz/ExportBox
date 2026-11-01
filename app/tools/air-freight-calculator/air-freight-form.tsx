// 名称: 空运计费表单（紧凑版）
// 描述: 单屏布局下的参数区：快捷场景、箱规、重量、泡重系数与运价
// 路径: ExportBox/app/tools/air-freight-calculator/air-freight-form.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import { Info } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { AIR_FREIGHT_DIVISORS } from '@/lib/tools/air-freight-calculator'
import { cn } from '@/lib/utils'
import { AIR_PRESETS, type DivisorChoice, type FormState, type NumericField } from './air-freight-page-data'

interface AirFreightFormProps {
  form: FormState
  divisorNote: string
  /** 当前生效的快捷场景名称，用于高亮提示 */
  activePreset: string | null
  onFieldChange: (field: NumericField, value: string) => void
  onDivisorChoice: (value: DivisorChoice) => void
  onPreset: (label: string, values: Partial<FormState>) => void
  summaryText: string
}

/** 卡片外壳：与报价计算器保持一致的边框、圆角与内边距 */
const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

export function AirFreightForm(props: AirFreightFormProps) {
  return (
    <div className={panelClass}>
      {/* 第一行：快捷场景 + 复制摘要 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">快捷场景</span>
          {AIR_PRESETS.map((preset) => {
            const active = props.activePreset === preset.label
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={active}
                onClick={() => props.onPreset(preset.label, preset.values)}
                className={cn(
                  'rounded-md border px-2 py-1 text-[11px] transition-colors',
                  active
                    ? 'border-blue-600 bg-blue-600 font-medium text-white shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-white/15 dark:text-slate-300 dark:hover:border-blue-300/40 dark:hover:bg-blue-400/10'
                )}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
        <EnhancedCopyButton
          text={props.summaryText}
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs"
        >
          复制摘要
        </EnhancedCopyButton>
      </div>

      {/* 箱规 + 重量：三列小字段 */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <MiniField field="lengthCm" label="外箱长 cm" value={props.form.lengthCm} onValueChange={props.onFieldChange} />
        <MiniField field="widthCm" label="外箱宽 cm" value={props.form.widthCm} onValueChange={props.onFieldChange} />
        <MiniField field="heightCm" label="外箱高 cm" value={props.form.heightCm} onValueChange={props.onFieldChange} />
        <MiniField field="grossWeightKg" label="单箱毛重 kg" step="0.01" value={props.form.grossWeightKg} onValueChange={props.onFieldChange} />
        <MiniField field="netWeightKg" label="单箱净重 kg" step="0.01" value={props.form.netWeightKg} onValueChange={props.onFieldChange} />
        <MiniField field="quantity" label="箱数 箱" step="1" value={props.form.quantity} onValueChange={props.onFieldChange} />
      </div>

      {/* 泡重系数 */}
      <div className="mt-3 flex flex-wrap items-center gap-2.5 rounded-lg bg-slate-50 px-2.5 py-2 dark:bg-white/5">
        <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">泡重系数</span>
        <Select value={props.form.divisorChoice} onValueChange={props.onDivisorChoice}>
          <SelectTrigger id="divisorChoice" className="h-7 w-[172px] shrink-0 bg-white px-2 text-xs dark:bg-slate-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(AIR_FREIGHT_DIVISORS) as Array<keyof typeof AIR_FREIGHT_DIVISORS>).map((key) => (
              <SelectItem key={key} value={key}>
                {AIR_FREIGHT_DIVISORS[key].label}
              </SelectItem>
            ))}
            <SelectItem value="custom">自定义</SelectItem>
          </SelectContent>
        </Select>
        <p className="min-w-0 flex-1 truncate text-[11px] text-slate-500 dark:text-slate-400" title={props.divisorNote}>
          {props.divisorNote}
        </p>
      </div>

      {props.form.divisorChoice === 'custom' && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          <MiniField field="divisor" label="自定义系数（体积 cm³ ÷ 系数 = kg）" value={props.form.divisor} onValueChange={props.onFieldChange} />
        </div>
      )}

      {/* 运价与附加费 */}
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-white/10">
        <MiniField field="ratePerKg" label="运价 元/kg" value={props.form.ratePerKg} onValueChange={props.onFieldChange} />
        <MiniField field="minCharge" label="最低消费 元" value={props.form.minCharge} onValueChange={props.onFieldChange} />
        <MiniField field="fuelSurchargePercent" label="燃油附加 %" step="0.1" value={props.form.fuelSurchargePercent} onValueChange={props.onFieldChange} />
        <MiniField field="handlingFee" label="操作费 元" value={props.form.handlingFee} onValueChange={props.onFieldChange} />
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        计费重 = max(毛重, 体积重)，体积重 = 长×宽×高 ÷ 泡重系数
      </p>
    </div>
  )
}

interface MiniFieldProps {
  field: NumericField
  label: string
  value: string
  onValueChange: (field: NumericField, value: string) => void
  step?: string
}

/** 小字段：标签在上、输入框在下，省纵向空间 */
function MiniField({ field, label, value, onValueChange, step = '0.01' }: MiniFieldProps) {
  return (
    <label htmlFor={field} className="block min-w-0">
      <span className="mb-1 block truncate text-[11px] text-slate-500 dark:text-slate-400" title={label}>
        {label}
      </span>
      <input
        id={field}
        type="text"
        inputMode={step === '1' ? 'numeric' : 'decimal'}
        pattern="[0-9]*[.]?[0-9]*"
        value={value}
        onChange={(event) => onValueChange(field, event.target.value)}
        className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[13px] font-medium tabular-nums text-slate-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-white/15 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400/60 dark:focus:ring-blue-400/20"
      />
    </label>
  )
}
