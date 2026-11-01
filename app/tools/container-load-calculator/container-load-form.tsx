// 名称: 装柜计算表单（紧凑版）
// 描述: 单屏布局下的参数区：快捷场景、柜型切换与箱规重量
// 路径: ExportBox/app/tools/container-load-calculator/container-load-form.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import { Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { cn } from '@/lib/utils'
import { CONTAINER_SPECS, type ContainerType } from '@/lib/tools/container-load-calculator'
import { CONTAINER_PRESETS, type FormState, type NumericField } from './container-load-page-data'

interface ContainerLoadFormProps {
  form: FormState
  doesNotFit: boolean
  onFieldChange: (field: NumericField, value: string) => void
  onContainerChange: (value: ContainerType) => void
  onPreset: (values: Partial<FormState>) => void
  summaryText: string
}

const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

export function ContainerLoadForm(props: ContainerLoadFormProps) {
  return (
    <div className={panelClass}>
      {/* 第一行：快捷场景 + 复制摘要 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">快捷场景</span>
          {CONTAINER_PRESETS.map((preset) => (
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
        <EnhancedCopyButton
          text={props.summaryText}
          disabled={props.doesNotFit}
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs"
        >
          复制摘要
        </EnhancedCopyButton>
      </div>

      {/* 柜型：四个按钮一键切换，比下拉更快 */}
      <div className="mt-3 flex items-center gap-2.5 rounded-lg bg-slate-50 px-2.5 py-2 dark:bg-white/5">
        <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">柜型</span>
        <div className="grid min-w-0 flex-1 grid-cols-4 gap-1.5">
          {Object.values(CONTAINER_SPECS).map((container) => {
            const active = props.form.containerType === container.type
            return (
              <button
                key={container.type}
                type="button"
                onClick={() => props.onContainerChange(container.type)}
                className={cn(
                  'h-7 rounded-md border text-[11px] font-medium transition-colors',
                  active
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-white/15 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                {container.type}
              </button>
            )
          })}
        </div>
      </div>

      {/* 箱规与数量 */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <MiniField field="lengthCm" label="外箱长 cm" value={props.form.lengthCm} onValueChange={props.onFieldChange} />
        <MiniField field="widthCm" label="外箱宽 cm" value={props.form.widthCm} onValueChange={props.onFieldChange} />
        <MiniField field="heightCm" label="外箱高 cm" value={props.form.heightCm} onValueChange={props.onFieldChange} />
        <MiniField field="grossWeightKg" label="单箱毛重 kg" step="0.1" value={props.form.grossWeightKg} onValueChange={props.onFieldChange} />
        <MiniField field="quantity" label="总箱数 箱" step="1" value={props.form.quantity} onValueChange={props.onFieldChange} />
      </div>

      {props.doesNotFit && (
        <Alert variant="destructive" className="mt-3 py-2">
          <Info className="h-4 w-4" />
          <AlertDescription>当前纸箱在所有旋转方向下都无法通过所选柜型内尺寸，请调整包装尺寸或运输方案。</AlertDescription>
        </Alert>
      )}

      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        结果为规则摆放估算，未考虑托盘、纸箱变形、装卸间隙、限重法规和船公司具体柜况。
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

function MiniField({ field, label, value, onValueChange, step = '1' }: MiniFieldProps) {
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
