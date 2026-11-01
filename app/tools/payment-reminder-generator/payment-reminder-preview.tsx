// 名称: 催款邮件预览
// 描述: 展示生成的邮件主题与正文，附催收行动建议（单屏紧凑版）
// 路径: ExportBox/app/tools/payment-reminder-generator/payment-reminder-preview.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { MailWarning, Receipt, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { REMINDER_STAGES, type ReminderEmail } from '@/lib/tools/payment-reminder-generator'
import { cn } from '@/lib/utils'

export interface PaymentReminderPreviewProps {
  email: ReminderEmail
  plainText: string
}

export function PaymentReminderPreview({ email, plainText }: PaymentReminderPreviewProps) {
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><MailWarning className="h-3.5 w-3.5" />邮件预览 · {email.stageLabel}</CardTitle>
            <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground">{email.toneNote}</p>
          </div>
          <div className="flex shrink-0 gap-1">
            <EnhancedCopyButton text={email.body} variant="ghost" className="h-6 px-1.5 text-[10px]">正文</EnhancedCopyButton>
            <EnhancedCopyButton text={plainText} variant="outline" className="h-6 px-2 text-[11px]">复制全文</EnhancedCopyButton>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 px-3 pt-0 pb-3">
          <div className="rounded-md border bg-muted/20 px-2.5 py-1.5">
            <p className="text-[10px] leading-4 text-muted-foreground">Subject</p>
            <p className="break-words text-[12px] font-semibold leading-5">{email.subject}</p>
          </div>
          <div className="max-h-64 overflow-y-auto rounded-md border bg-white/85 px-3 py-2 dark:bg-white/4">
            <p className="whitespace-pre-wrap break-words text-[11px] leading-5">{email.body}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="px-3 pt-2.5 pb-1.5">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><TrendingUp className="h-3.5 w-3.5" />催收节奏</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5 px-3 pt-0 pb-3">
            {REMINDER_STAGES.map((stage) => (
              <div key={stage.id} className={cn('rounded px-1.5 py-1', stage.id === email.stage && 'bg-emerald-50/70 dark:bg-cyan-300/10')}>
                <p className="flex items-center justify-between gap-2 text-[11px] font-medium leading-4">
                  <span className="truncate">{stage.label}</span>
                  <span className="shrink-0 text-[10px] font-normal text-muted-foreground">{stage.range}</span>
                </p>
                <p className="truncate text-[10px] leading-4 text-muted-foreground" title={stage.action}>{stage.action}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-3 pt-2.5 pb-1.5">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><Receipt className="h-3.5 w-3.5" />本档注意事项</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pt-0 pb-3">
            <ul className="space-y-1 text-[11px] leading-4 text-muted-foreground">
              {email.tips.map((tip) => <li key={tip} className="flex items-start gap-1.5"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/50" />{tip}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
