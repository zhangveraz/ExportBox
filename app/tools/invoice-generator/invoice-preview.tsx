// 名称: 商业发票预览组件
// 描述: 以 A4 版式实时预览发票，支持复制纯文本与打印
// 路径: ExportBox/app/tools/invoice-generator/invoice-preview.tsx
// 作者: ExportBox
// 更新时间: 2026-09-30

'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import type { InvoiceInput, InvoiceTotals } from '@/lib/tools/invoice-generator'
import { INVOICE_TYPE_NOTES } from './invoice-data'

export interface InvoicePreviewProps {
  input: InvoiceInput
  totals: InvoiceTotals
  plainText: string
}

export function InvoicePreview({ input, totals, plainText }: InvoicePreviewProps) {
  const title = input.invoiceType === 'proforma' ? 'PROFORMA INVOICE' : 'COMMERCIAL INVOICE'
  const typeNote = INVOICE_TYPE_NOTES.find((note) => note.type === input.invoiceType)

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <Button type="button" onClick={() => window.print()} className="h-7 px-2.5 text-[11px]">
          <Printer className="mr-1.5 h-3.5 w-3.5" />打印 / 导出 PDF
        </Button>
        <EnhancedCopyButton text={plainText} variant="outline" className="h-7 px-2 text-[11px]">复制纯文本</EnhancedCopyButton>
      </div>

      <div className="max-h-[calc(100vh-230px)] overflow-auto rounded-lg border print:max-h-none print:overflow-visible print:border-0">
      <div className="mx-auto w-full max-w-[820px] bg-white p-5 text-slate-900 shadow-xs print:max-w-none print:p-0 print:shadow-none dark:bg-slate-900 dark:text-slate-100">
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 dark:border-slate-100">
          <div>
            <h2 className="text-xl font-black tracking-wide">{title}</h2>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">INVOICE NO.: <span className="font-semibold text-slate-900 dark:text-slate-100">{input.invoiceNo}</span></p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">DATE: <span className="font-semibold text-slate-900 dark:text-slate-100">{input.invoiceDate}</span></p>
          </div>
          <div className="max-w-[280px] text-right text-[10px] leading-5 text-slate-600 dark:text-slate-300">
            <p className="font-bold">{input.seller.name}</p>
            <p className="whitespace-pre-line">{input.seller.address}</p>
            {(input.seller.tel || input.seller.email) && (
              <p>{[input.seller.tel, input.seller.email].filter(Boolean).join(' · ')}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-slate-300 py-3 dark:border-slate-600">
          <PartyBlock label="BUYER" name={input.buyer.name} address={input.buyer.address} contact={[input.buyer.tel, input.buyer.email].filter(Boolean).join(' · ')} />
          <div className="space-y-1 text-[11px]">
            <MetaRow label="PAYMENT TERMS" value={input.paymentTerms} />
            <MetaRow label="INCOTERM" value={input.incoterm} />
            {input.portOfLoading && <MetaRow label="PORT OF LOADING" value={input.portOfLoading} />}
            {input.portOfDischarge && <MetaRow label="PORT OF DISCHARGE" value={input.portOfDischarge} />}
            <MetaRow label="CURRENCY" value={input.currency} />
          </div>
        </div>

        <table className="mt-3 w-full border-collapse text-[11px]">
          <thead>
            <tr className="border border-slate-400 bg-slate-100 text-left text-[10px] uppercase tracking-wide dark:border-slate-500 dark:bg-slate-800">
              <th className="border border-slate-400 px-2 py-1.5 dark:border-slate-500">No.</th>
              <th className="border border-slate-400 px-2 py-1.5 dark:border-slate-500">Description</th>
              <th className="border border-slate-400 px-2 py-1.5 text-right dark:border-slate-500">Qty</th>
              <th className="border border-slate-400 px-2 py-1.5 dark:border-slate-500">Unit</th>
              <th className="border border-slate-400 px-2 py-1.5 text-right dark:border-slate-500">Unit Price</th>
              <th className="border border-slate-400 px-2 py-1.5 text-right dark:border-slate-500">Amount</th>
            </tr>
          </thead>
          <tbody>
            {totals.lines.map((line, index) => (
              <tr key={line.id} className="border border-slate-400 align-top dark:border-slate-500">
                <td className="border border-slate-400 px-2 py-1.5 dark:border-slate-500">{index + 1}</td>
                <td className="border border-slate-400 px-2 py-1.5 dark:border-slate-500">{line.description}</td>
                <td className="border border-slate-400 px-2 py-1.5 text-right tabular-nums dark:border-slate-500">{line.quantity.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                <td className="border border-slate-400 px-2 py-1.5 dark:border-slate-500">{line.unit}</td>
                <td className="border border-slate-400 px-2 py-1.5 text-right tabular-nums dark:border-slate-500">{formatAmount(line.unitPrice)}</td>
                <td className="border border-slate-400 px-2 py-1.5 text-right tabular-nums dark:border-slate-500">{formatAmount(line.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 flex justify-end">
          <div className="w-full max-w-xs space-y-1 text-[11px]">
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Subtotal</span><span className="tabular-nums font-medium">{formatAmount(totals.subtotal)} {input.currency}</span></div>
            {totals.tax > 0 && (
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Tax ({input.taxPercent}%)</span><span className="tabular-nums font-medium">{formatAmount(totals.tax)} {input.currency}</span></div>
            )}
            <div className="flex justify-between border-t-2 border-slate-900 pt-1 text-[13px] font-bold dark:border-slate-100">
              <span>TOTAL</span><span className="tabular-nums">{formatAmount(totals.total)} {input.currency}</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] font-semibold">{totals.totalInWordsEn}</p>

        {input.bankDetails && (
          <div className="mt-3 border-t border-slate-300 pt-3 text-[10px] leading-5 dark:border-slate-600">
            <p className="font-bold uppercase tracking-wide">Bank Details</p>
            <p className="whitespace-pre-line">{input.bankDetails}</p>
          </div>
        )}

        {input.notes.length > 0 && (
          <div className="mt-3 text-[10px] leading-5">
            <p className="font-bold uppercase tracking-wide">Notes</p>
            <ul className="ml-4 list-disc space-y-0.5">
              {input.notes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </div>
        )}

        <div className="mt-3 flex items-end justify-between border-t border-slate-300 pt-2 dark:border-slate-600">
          <div className="flex h-10 w-48 items-end border-b border-slate-500 pb-1 text-[10px] text-slate-400">For {input.seller.name}</div>
          <p className="text-[10px] text-slate-400">Authorized Signature</p>
        </div>
      </div>
      </div>

      {typeNote && (
        <details className="rounded-lg border bg-muted/30 px-3 py-1.5 text-[11px] leading-5 print:hidden">
          <summary className="cursor-pointer list-none font-medium text-foreground/80">{input.invoiceType === 'proforma' ? '形式发票 PI' : '商业发票 CI'}：{typeNote.summary}（使用要点）</summary>
          <ul className="mt-1 ml-4 list-disc space-y-0.5 border-t pt-1 text-muted-foreground">
            {typeNote.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </details>
      )}
    </div>
  )
}

function PartyBlock({ label, name, address, contact }: { label: string; name: string; address: string; contact: string }) {
  return (
    <div className="text-[11px]">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-bold">{name}</p>
      <p className="whitespace-pre-line text-slate-600 dark:text-slate-300">{address}</p>
      {contact && <p className="text-slate-600 dark:text-slate-300">{contact}</p>}
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <p><span className="mr-2 inline-block min-w-[120px] text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span><span className="font-medium">{value}</span></p>
  )
}

function formatAmount(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
