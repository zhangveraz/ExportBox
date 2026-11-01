// 名称: 装柜计算表单（对齐出口退税布局）
// 描述: 参数卡采用快捷场景 + 柜型切换 + 密集尺寸网格，1080p 下一屏完成录入
// 路径: ExportBox/app/tools/container-load-calculator/container-load-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Container, Info, RotateCcw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { cn } from '@/lib/utils'
import { CONTAINER_SPECS, type ContainerType } from '@/lib/tools/container-load-calculator'
import { CONTAINER_PRESETS, INITIAL_FORM, type FormState, type NumericField } from './container-load-page-data'

interface ContainerLoadFormProps {
  form: FormState
  doesNotFit: boolean
  onFieldChange: (field: NumericField, value: string) => void
  onContainerChange: (value: ContainerType) => void
  onPreset: (values: Partial<FormState>) => void
  summaryText: string
}

export function ContainerLoadForm(props: ContainerLoadFormProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-3 pt-2.5 pb-1">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-1.5 text-[13px] font-semibold">
              <Container className="h-4 w-4" />
              箱规与柜型
            </CardTitle>
            <p className="text-[10px] leading-3 text-muted-foreground">六种摆放方向自动试算，取单柜可装箱数最多的方向</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <EnhancedCopyButton text={props.summaryText} disabled={props.doesNotFit} variant="outline" size="sm" className="h-7 px-2 text-[11px]">
              复制摘要
            </EnhancedCopyButton>
            <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={() => props.onPreset(INITIAL_FORM)}>
              <RotateCcw className="mr-1 h-3 w-3" />
              重置
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 px-3 pt-0 pb-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">快捷场景</span>
          {CONTAINER_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => props.onPreset(preset.values)}
              className="h-6 rounded-md border px-2 text-[11px] text-slate-600 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:border-white/15 dark:text-slate-300"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 px-2 py-1.5">
          <span className="shrink-0 text-[11px] text-slate-600 dark:text-slate-300">柜型</span>
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
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary dark:border-white/15 dark:bg-slate-900 dark:text-slate-300'
                  )}
                >
                  {container.type}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-2.5 gap-y-1.5 md:grid-cols-5">
          <MiniField field="lengthCm" label="外箱长" suffix="cm" value={props.form.lengthCm} onValueChange={props.onFieldChange} />
          <MiniField field="widthCm" label="外箱宽" suffix="cm" value={props.form.widthCm} onValueChange={props.onFieldChange} />
          <MiniField field="heightCm" label="外箱高" suffix="cm" value={props.form.heightCm} onValueChange={props.onFieldChange} />
          <MiniField field="grossWeightKg" label="单箱毛重" suffix="kg" step="0.1" value={props.form.grossWeightKg} onValueChange={props.onFieldChange} />
          <MiniField field="quantity" label="总箱数" suffix="箱" value={props.form.quantity} onValueChange={props.onFieldChange} />
        </div>

        {props.doesNotFit && (
          <Alert variant="destructive" className="py-1.5">
            <Info className="h-3.5 w-3.5" />
            <AlertDescription className="text-[11px] leading-4">当前纸箱在所有旋转方向下都无法通过所选柜型内尺寸，请调整包装尺寸或运输方案。</AlertDescription>
          </Alert>
        )}

        <p className="flex items-start gap-1.5 border-t pt-1.5 text-[10px] leading-4 text-muted-foreground">
          <Info className="mt-px h-3 w-3 shrink-0" />
          结果为规则摆放估算，未考虑托盘、纸箱变形、装卸间隙、限重法规和船公司具体柜况，建议留 5%~10% 余量。
        </p>
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
  step?: string
}

function MiniField({ field, label, suffix, value, onValueChange, step = '1' }: MiniFieldProps) {
  return (
    <label htmlFor={field} className="block min-w-0 space-y-1">
      <span className="block truncate text-[11px] leading-3 text-slate-600 dark:text-slate-300" title={label}>{label}</span>
      <span className="relative block">
        <input
          id={field}
          type="text"
          inputMode={step === '1' ? 'numeric' : 'decimal'}
          value={value}
          onChange={(event) => onValueChange(field, event.target.value)}
          className="h-8 w-full rounded-md border border-slate-200 bg-white pr-7 pl-2 text-[13px] font-medium tabular-nums text-slate-900 outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15 dark:border-white/15 dark:bg-slate-900 dark:text-white"
        />
        <span className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-[10px] text-muted-foreground">{suffix}</span>
      </span>
    </label>
  )
}
