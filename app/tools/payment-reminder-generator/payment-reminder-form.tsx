// 名称: 催款邮件表单
// 描述: 采集发票与账期信息，展示四档催款语气选择（单屏紧凑版）
// 路径: ExportBox/app/tools/payment-reminder-generator/payment-reminder-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormattedInput } from '@/components/ui/formatted-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { REMINDER_STAGES, recommendStage, type ReminderStage } from '@/lib/tools/payment-reminder-generator'
import { cn } from '@/lib/utils'

export interface ReminderFormState {
  customerName: string
  invoiceNo: string
  amount: string
  currency: string
  dueDate: string
  overdueDays: string
  paymentTerms: string
  senderName: string
}

export interface PaymentReminderFormProps {
  form: ReminderFormState
  stage: ReminderStage
  onChange: (patch: Partial<ReminderFormState>) => void
  onStageChange: (stage: ReminderStage) => void
  onReset: () => void
}

const LABEL = 'text-[11px] leading-4'

export function PaymentReminderForm({ form, stage, onChange, onStageChange, onReset }: PaymentReminderFormProps) {
  const overdueDays = Number.parseInt(form.overdueDays, 10)
  const recommended = Number.isFinite(overdueDays) ? recommendStage(overdueDays) : null

  return (
    <Card className="self-start">
      <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
        <div className="min-w-0">
          <CardTitle className="text-sm font-semibold">催款信息</CardTitle>
          <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground">填写发票要素，按逾期天数选择催款语气</p>
        </div>
        <Button type="button" variant="outline" onClick={onReset} className="h-6 shrink-0 px-2 text-[11px]">
          <RefreshCw className="mr-1 h-3 w-3" />重置
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 px-3 pt-0 pb-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <Field id="customerName" label="客户名称" value={form.customerName} onChange={(value) => onChange({ customerName: value })} placeholder="NORDIC HOME AB" autoFocus />
          <Field id="invoiceNo" label="发票号" value={form.invoiceNo} onChange={(value) => onChange({ invoiceNo: value })} placeholder="INV-2026-0930" />
          <div className="space-y-1">
            <Label htmlFor="amount" className={LABEL}>发票金额</Label>
            <div className="relative">
              <FormattedInput id="amount" value={form.amount} onChange={(value) => onChange({ amount: value })} format="decimal" maxDecimals={2} className="h-8 pr-16 text-[12px] font-medium" />
              <input
                value={form.currency}
                onChange={(event) => onChange({ currency: event.target.value.toUpperCase() })}
                maxLength={6}
                aria-label="币种"
                className="absolute inset-y-1 right-1 w-14 rounded border border-slate-200 bg-slate-50 px-1 text-center text-[10px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
              />
            </div>
          </div>
          <Field id="dueDate" label="付款到期日" value={form.dueDate} onChange={(value) => onChange({ dueDate: value })} placeholder="2026-09-15" />
          <div className="space-y-1">
            <Label htmlFor="overdueDays" className={LABEL}>逾期天数</Label>
            <FormattedInput id="overdueDays" value={form.overdueDays} onChange={(value) => onChange({ overdueDays: value })} format="number" maxDecimals={0} className="h-8 text-[12px] font-medium" />
            {recommended && <p className="truncate text-[10px] leading-4 text-muted-foreground">推荐档位：<span className="font-medium text-emerald-700 dark:text-cyan-300">{recommendStageLabel(recommended)}</span></p>}
          </div>
          <Field id="paymentTerms" label="付款条款（可选）" value={form.paymentTerms} onChange={(value) => onChange({ paymentTerms: value })} placeholder="T/T 30 days after B/L date" />
          <Field id="senderName" label="署名（可选）" value={form.senderName} onChange={(value) => onChange({ senderName: value })} placeholder="Amy Chen / Sales Dept." />
        </div>

        <div className="space-y-1">
          <Label className={LABEL}>催款语气<span className="ml-1 font-normal text-muted-foreground">（点击切换，默认按逾期天数推荐）</span></Label>
          <div className="grid grid-cols-2 gap-1">
            {REMINDER_STAGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onStageChange(item.id)}
                aria-pressed={stage === item.id}
                className={cn(
                  'rounded-md border px-2 py-1 text-left transition-all',
                  stage === item.id
                    ? 'border-emerald-400 bg-emerald-50/80 dark:border-cyan-300/50 dark:bg-cyan-300/10'
                    : 'border-slate-200 bg-white/70 hover:border-emerald-200 dark:border-white/10 dark:bg-white/4'
                )}
              >
                <span className="flex items-center gap-1.5">
                  <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', stage === item.id ? 'bg-emerald-500' : 'bg-slate-300')} />
                  <span className="truncate text-[11px] font-semibold leading-4">{item.label}</span>
                  <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">{item.range}</span>
                </span>
                <span className="mt-0.5 block truncate text-[10px] leading-4 text-muted-foreground" title={item.tone}>{item.tone}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function recommendStageLabel(stage: ReminderStage): string {
  return REMINDER_STAGES.find((item) => item.id === stage)?.label ?? stage
}

function Field({ id, label, value, onChange, placeholder, autoFocus = false }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder?: string; autoFocus?: boolean }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className={LABEL}>{label}</Label>
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-8 text-[12px] font-medium" maxLength={120} autoFocus={autoFocus} />
    </div>
  )
}
