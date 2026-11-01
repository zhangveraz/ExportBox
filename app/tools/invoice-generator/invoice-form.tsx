// 名称: 商业发票表单
// 描述: 采集买卖双方信息、发票参数与动态明细行（单屏紧凑版）
// 路径: ExportBox/app/tools/invoice-generator/invoice-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { FileText, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormattedInput } from '@/components/ui/formatted-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { InvoiceType } from '@/lib/tools/invoice-generator'
import { CURRENCY_OPTIONS, INCOTERM_OPTIONS, INVOICE_TYPE_OPTIONS, PAYMENT_TERM_OPTIONS, SAMPLE_INVOICE } from './invoice-data'

export interface InvoiceLineFormState {
  id: string
  description: string
  quantity: string
  unit: string
  unitPrice: string
}

export interface InvoiceFormState {
  invoiceNo: string
  invoiceDate: string
  invoiceType: InvoiceType
  currency: string
  sellerName: string
  sellerAddress: string
  sellerTel: string
  sellerEmail: string
  buyerName: string
  buyerAddress: string
  buyerTel: string
  buyerEmail: string
  paymentTerms: string
  incoterm: string
  portOfLoading: string
  portOfDischarge: string
  bankDetails: string
  notesText: string
  taxPercent: string
  lines: InvoiceLineFormState[]
}

export interface InvoiceFormProps {
  form: InvoiceFormState
  onChange: (patch: Partial<InvoiceFormState>) => void
  onLineChange: (lineId: string, field: keyof Omit<InvoiceLineFormState, 'id'>, value: string) => void
  onAddLine: () => void
  onRemoveLine: (lineId: string) => void
  onReset: () => void
}

export function createInvoiceFormState(): InvoiceFormState {
  return { ...SAMPLE_INVOICE, taxPercent: '0' }
}

const LABEL = 'text-[10px] font-medium leading-4 text-muted-foreground'

export function InvoiceForm({ form, onChange, onLineChange, onAddLine, onRemoveLine, onReset }: InvoiceFormProps) {
  return (
    <Card className="print:hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><FileText className="h-3.5 w-3.5" />发票信息</CardTitle>
          <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground">填写后右侧实时生成 A4 版式发票</p>
        </div>
        <Button type="button" variant="outline" onClick={onReset} className="h-6 shrink-0 px-2 text-[11px]">
          <RefreshCw className="mr-1 h-3 w-3" />重置为示例
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 px-3 pt-0 pb-3">
        {/* 发票类型 / 币种 一行，发票号 / 发票日期 一行：四个输入框等宽排成 2×2，更整齐 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="invoiceType" className={LABEL}>发票类型</Label>
            <Select value={form.invoiceType} onValueChange={(value) => onChange({ invoiceType: value as InvoiceType })}>
              <SelectTrigger id="invoiceType" className="h-7 w-full min-w-0 text-[12px]">
                <SelectValue placeholder="选择发票类型" />
              </SelectTrigger>
              <SelectContent className="min-w-[260px]">
                {INVOICE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-[12px]">
                    <span className="font-medium">{option.label}</span>
                    <span className="ml-1.5 text-[10px] text-muted-foreground">{option.abbr} · {option.en}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="currency" className={LABEL}>币种</Label>
            <Input id="currency" list="invoice-currency-options" value={form.currency} onChange={(event) => onChange({ currency: event.target.value })} className="h-7 text-[12px] font-medium" maxLength={8} />
            <datalist id="invoice-currency-options">{CURRENCY_OPTIONS.map((code) => <option key={code} value={code} />)}</datalist>
          </div>
          <TextField id="invoiceNo" label="发票号" value={form.invoiceNo} onChange={(value) => onChange({ invoiceNo: value })} placeholder="INV-2026-0001" />
          <TextField id="invoiceDate" label="发票日期" value={form.invoiceDate} onChange={(value) => onChange({ invoiceDate: value })} placeholder="2026-09-30" />
        </div>

        <div className="grid gap-2 lg:grid-cols-2">
          <PartyFields
            field="seller"
            title="卖方 Seller"
            name={form.sellerName}
            address={form.sellerAddress}
            tel={form.sellerTel}
            email={form.sellerEmail}
            onChange={(patch) => onChange({
              sellerName: patch.name ?? form.sellerName,
              sellerAddress: patch.address ?? form.sellerAddress,
              sellerTel: patch.tel ?? form.sellerTel,
              sellerEmail: patch.email ?? form.sellerEmail,
            })}
          />
          <PartyFields
            field="buyer"
            title="买方 Buyer"
            name={form.buyerName}
            address={form.buyerAddress}
            tel={form.buyerTel}
            email={form.buyerEmail}
            onChange={(patch) => onChange({
              buyerName: patch.name ?? form.buyerName,
              buyerAddress: patch.address ?? form.buyerAddress,
              buyerTel: patch.tel ?? form.buyerTel,
              buyerEmail: patch.email ?? form.buyerEmail,
            })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="paymentTerms" className={LABEL}>付款条款</Label>
            <Input id="paymentTerms" list="invoice-payment-options" value={form.paymentTerms} onChange={(event) => onChange({ paymentTerms: event.target.value })} className="h-7 text-[12px]" maxLength={120} />
            <datalist id="invoice-payment-options">{PAYMENT_TERM_OPTIONS.map((term) => <option key={term} value={term} />)}</datalist>
          </div>
          <div className="space-y-1">
            <Label htmlFor="incoterm" className={LABEL}>贸易术语</Label>
            <Input id="incoterm" list="invoice-incoterm-options" value={form.incoterm} onChange={(event) => onChange({ incoterm: event.target.value })} className="h-7 text-[12px]" maxLength={60} />
            <datalist id="invoice-incoterm-options">{INCOTERM_OPTIONS.map((term) => <option key={term} value={term} />)}</datalist>
          </div>
          <TextField id="portOfLoading" label="装运港" value={form.portOfLoading} onChange={(value) => onChange({ portOfLoading: value })} />
          <TextField id="portOfDischarge" label="卸货港" value={form.portOfDischarge} onChange={(value) => onChange({ portOfDischarge: value })} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold leading-4">明细行<span className="ml-1 font-normal text-muted-foreground">（最多 20 行，品名建议含材质、型号与规格）</span></p>
            <Button type="button" variant="outline" onClick={onAddLine} disabled={form.lines.length >= 20} className="h-6 shrink-0 px-2 text-[11px]">
              <Plus className="mr-1 h-3 w-3" />添加明细
            </Button>
          </div>
          {form.lines.map((line, index) => (
            <div key={line.id} className="grid gap-1.5 rounded-md border bg-muted/20 px-2 py-1.5 lg:grid-cols-[minmax(0,1fr)_100px_70px_110px_28px] lg:items-end">
              <div className="space-y-0.5">
                <Label htmlFor={`${line.id}-description`} className="text-[10px] leading-4 text-muted-foreground">第 {index + 1} 行 品名描述</Label>
                <Input id={`${line.id}-description`} value={line.description} onChange={(event) => onLineChange(line.id, 'description', event.target.value)} maxLength={160} className="h-7 text-[12px]" />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor={`${line.id}-quantity`} className="text-[10px] leading-4 text-muted-foreground">数量</Label>
                <FormattedInput id={`${line.id}-quantity`} value={line.quantity} onChange={(value) => onLineChange(line.id, 'quantity', value)} format="decimal" maxDecimals={2} className="h-7 text-[12px]" />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor={`${line.id}-unit`} className="text-[10px] leading-4 text-muted-foreground">单位</Label>
                <Input id={`${line.id}-unit`} value={line.unit} onChange={(event) => onLineChange(line.id, 'unit', event.target.value)} maxLength={12} placeholder="PCS" className="h-7 text-[12px]" />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor={`${line.id}-unitPrice`} className="text-[10px] leading-4 text-muted-foreground">单价 {form.currency}</Label>
                <FormattedInput id={`${line.id}-unitPrice`} value={line.unitPrice} onChange={(value) => onLineChange(line.id, 'unitPrice', value)} format="decimal" maxDecimals={4} className="h-7 text-[12px]" />
              </div>
              <Button type="button" variant="ghost" size="icon" title="删除明细" aria-label={`删除第 ${index + 1} 行明细`} disabled={form.lines.length <= 1} onClick={() => onRemoveLine(line.id)} className="h-7 w-7">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="taxPercent" className={LABEL}>税率 %（外贸常为 0）</Label>
            <FormattedInput id="taxPercent" value={form.taxPercent} onChange={(value) => onChange({ taxPercent: value })} format="decimal" maxDecimals={2} className="h-7 text-[12px] font-medium" />
          </div>
          <div className="col-span-1 space-y-1 lg:col-span-3">
            <Label htmlFor="bankDetails" className={LABEL}>银行信息（可选）</Label>
            <Input id="bankDetails" value={form.bankDetails} onChange={(event) => onChange({ bankDetails: event.target.value })} className="h-7 text-[12px]" maxLength={200} />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="notesText" className={LABEL}>备注（每行一条）</Label>
          <Textarea id="notesText" value={form.notesText} onChange={(event) => onChange({ notesText: event.target.value })} className="min-h-[52px] text-[12px] leading-5" />
        </div>
      </CardContent>
    </Card>
  )
}

interface PartyFieldsProps {
  field: 'seller' | 'buyer'
  title: string
  name: string
  address: string
  tel: string
  email: string
  onChange: (patch: { name?: string; address?: string; tel?: string; email?: string }) => void
}

function PartyFields({ field, title, name, address, tel, email, onChange }: PartyFieldsProps) {
  return (
    <fieldset className="space-y-1.5 rounded-md border px-2 py-1.5">
      <legend className="px-1 text-[11px] font-semibold leading-4">{title}</legend>
      <div className="grid grid-cols-2 gap-1.5">
        <TextField id={`${field}-name`} label="公司名称" value={name} onChange={(value) => onChange({ name: value })} />
        <TextField id={`${field}-tel`} label="电话" value={tel} onChange={(value) => onChange({ tel: value })} />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor={`${field}-address`} className="text-[10px] leading-4 text-muted-foreground">地址</Label>
        <Textarea
          id={`${field}-address`}
          value={address}
          onChange={(event) => onChange({ address: event.target.value })}
          className="field-sizing-content min-h-[44px] text-[12px] leading-4"
          maxLength={300}
        />
      </div>
      {/* 邮箱跟地址一样独占一行、随内容自动撑高，长邮箱不再被截断 */}
      <div className="space-y-0.5">
        <Label htmlFor={`${field}-email`} className="text-[10px] leading-4 text-muted-foreground">邮箱</Label>
        <Textarea
          id={`${field}-email`}
          value={email}
          rows={1}
          onChange={(event) => onChange({ email: event.target.value })}
          className="field-sizing-content min-h-[30px] break-all text-[12px] leading-4"
          maxLength={200}
        />
      </div>
    </fieldset>
  )
}

function TextField({ id, label, value, onChange, placeholder }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-0.5">
      <Label htmlFor={id} className="text-[10px] font-medium leading-4 text-muted-foreground">{label}</Label>
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-7 text-[12px]" maxLength={200} />
    </div>
  )
}
