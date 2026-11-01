// 名称: 邮件签名表单
// 描述: 采集签名要素并实时生成（单屏紧凑版）
// 路径: ExportBox/app/tools/email-signature-generator/email-signature-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { IdCard, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface SignatureFormState {
  name: string
  title: string
  company: string
  phone: string
  mobile: string
  email: string
  website: string
  address: string
  whatsapp: string
  logoUrl: string
}

export interface EmailSignatureFormProps {
  form: SignatureFormState
  onChange: (patch: Partial<SignatureFormState>) => void
  onReset: () => void
}

const LABEL = 'text-[11px] leading-4'

export function EmailSignatureForm({ form, onChange, onReset }: EmailSignatureFormProps) {
  const filled = Object.values(form).filter((value) => value.trim().length > 0).length
  return (
    <Card className="self-start">
      <CardHeader className="flex flex-row items-start justify-between gap-2 px-3 pt-2.5 pb-1.5">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><IdCard className="h-3.5 w-3.5" />签名信息</CardTitle>
          <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground">已填 {filled}/10 项 · 除姓名、邮箱外均可留空</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onReset} className="h-6 shrink-0 px-2 text-[11px]"><RefreshCw className="mr-1 h-3 w-3" />重置</Button>
      </CardHeader>
      <CardContent className="px-3 pt-0 pb-3">
        <div className="grid grid-cols-2 gap-2">
          <Field id="name" label="姓名 *" value={form.name} onChange={(value) => onChange({ name: value })} placeholder="Vera Zhang" autoFocus />
          <Field id="title" label="职位" value={form.title} onChange={(value) => onChange({ title: value })} placeholder="Sales Manager" />
          <Field id="company" label="公司" value={form.company} onChange={(value) => onChange({ company: value })} placeholder="ExportBox Trading Co., Ltd." />
          <Field id="email" label="邮箱 *" value={form.email} onChange={(value) => onChange({ email: value })} placeholder="hello@ExportBox.com" />
          <Field id="phone" label="座机 / 传真" value={form.phone} onChange={(value) => onChange({ phone: value })} placeholder="+86 574 8888 6666" />
          <Field id="mobile" label="手机" value={form.mobile} onChange={(value) => onChange({ mobile: value })} placeholder="+86 138 0000 0000" />
          <Field id="whatsapp" label="WhatsApp 显示文本" value={form.whatsapp} onChange={(value) => onChange({ whatsapp: value })} placeholder="+86 138 0000 0000" />
          <Field id="website" label="网站" value={form.website} onChange={(value) => onChange({ website: value })} placeholder="www.ExportBox.com" />
          <div className="col-span-2 space-y-1">
            <Label htmlFor="address" className={LABEL}>公司地址</Label>
            <Input id="address" value={form.address} onChange={(event) => onChange({ address: event.target.value })} className="h-8 text-[12px]" maxLength={160} placeholder="No. 88 Zhongshan East Road, Ningbo, China" />
          </div>
          <div className="col-span-2 space-y-1">
            <Label htmlFor="logoUrl" className={LABEL}>Logo 图片地址 <span className="font-normal text-muted-foreground">（可选，需 https 直链）</span></Label>
            <Input id="logoUrl" value={form.logoUrl} onChange={(event) => onChange({ logoUrl: event.target.value })} className="h-8 text-[12px]" maxLength={300} placeholder="https://example.com/logo.png" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Field({ id, label, value, onChange, placeholder, autoFocus = false }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder?: string; autoFocus?: boolean }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className={LABEL}>{label}</Label>
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-8 text-[12px]" maxLength={120} autoFocus={autoFocus} />
    </div>
  )
}
