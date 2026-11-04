// 名称: 发票 Excel 版式
// 描述: 把发票数据排成与 A4 预览一致的表格，供「导出 Excel」下载
// 路径: ExportBox/app/tools/invoice-generator/invoice-workbook.ts
// 作者: ExportBox
// 更新时间: 2026-11-03

import type { InvoiceInput, InvoiceTotals } from '@/lib/tools/invoice-generator'
import type { XlsxCell, XlsxRow, XlsxSheet } from '@/lib/tools/xlsx-export'

const COLUMNS = [6, 42, 10, 8, 15, 17]
const LAST_COLUMN = COLUMNS.length - 1

const HEADER_FILL = 'F1F5F9'
const TOTAL_FILL = 'E2E8F0'

/** 整行铺满的小标题 */
function fullRow(value: string, cell: Omit<XlsxCell, 'value'> = {}): XlsxRow {
  return { cells: [{ value, colSpan: COLUMNS.length, border: true, ...cell }] }
}

function pairRow(leftLabel: string, leftValue: string, rightLabel: string, rightValue: string): XlsxRow {
  return {
    cells: [
      { value: leftLabel, bold: true, size: 10 },
      { value: leftValue, colSpan: 2 },
      { value: rightLabel, bold: true, size: 10 },
      { value: rightValue, colSpan: 2 },
    ],
  }
}

function partyBlock(label: string, party: { name: string; address: string; tel?: string; email?: string }): XlsxRow[] {
  const contact = [party.tel, party.email].filter(Boolean).join(' · ')
  const lines = [party.name, party.address, contact].filter((item) => Boolean(item && item.trim()))
  return [
    {
      cells: [
        { value: label, bold: true, size: 10 },
        { value: lines.join('\n'), colSpan: COLUMNS.length - 1, wrap: true, size: 10 },
      ],
      height: Math.max(16, lines.length * 14),
    },
  ]
}

/** 生成商业发票 / 形式发票的 Excel 版式 */
export function buildInvoiceWorkbook(input: InvoiceInput, totals: InvoiceTotals): XlsxSheet {
  const title = input.invoiceType === 'proforma' ? 'PROFORMA INVOICE' : 'COMMERCIAL INVOICE'
  const rows: XlsxRow[] = []

  // 标题
  rows.push({
    cells: [{ value: title, colSpan: COLUMNS.length, bold: true, size: 16, align: 'center' }],
    height: 28,
  })

  // 抬头信息：发票号 / 日期
  rows.push(pairRow('INVOICE NO.', input.invoiceNo, 'DATE', input.invoiceDate))

  // 买卖双方
  rows.push(...partyBlock('SELLER', input.seller))
  rows.push(...partyBlock('BUYER', input.buyer))

  // 交易条款
  rows.push(pairRow('PAYMENT TERMS', input.paymentTerms, 'INCOTERM', input.incoterm))
  rows.push(pairRow('PORT OF LOADING', input.portOfLoading || '--', 'PORT OF DISCHARGE', input.portOfDischarge || '--'))
  rows.push(fullRow(`CURRENCY: ${input.currency}`, { size: 10, bold: true }))

  // 明细表头
  const headerCells: XlsxCell[] = [
    { value: 'No.', bold: true, align: 'center', border: true, fill: HEADER_FILL },
    { value: 'Description', bold: true, border: true, fill: HEADER_FILL },
    { value: 'Qty', bold: true, align: 'right', border: true, fill: HEADER_FILL },
    { value: 'Unit', bold: true, align: 'center', border: true, fill: HEADER_FILL },
    { value: 'Unit Price', bold: true, align: 'right', border: true, fill: HEADER_FILL },
    { value: 'Amount', bold: true, align: 'right', border: true, fill: HEADER_FILL },
  ]
  rows.push({ cells: headerCells, height: 20 })

  // 明细行
  totals.lines.forEach((line, index) => {
    rows.push({
      cells: [
        { value: index + 1, align: 'center', border: true },
        { value: line.description, border: true, wrap: true },
        { value: line.quantity, align: 'right', border: true, decimals: 2 },
        { value: line.unit, align: 'center', border: true },
        { value: line.unitPrice, align: 'right', border: true, decimals: 2 },
        { value: line.amount, align: 'right', border: true, decimals: 2 },
      ],
      height: 18,
    })
  })

  // 小计 / 税 / 合计，右对齐的金额块
  const moneyRows: { label: string; value: number }[] = [{ label: 'Subtotal', value: totals.subtotal }]
  if (totals.tax > 0) moneyRows.push({ label: `Tax (${input.taxPercent ?? 0}%)`, value: totals.tax })
  moneyRows.push({ label: 'TOTAL', value: totals.total })

  moneyRows.forEach((item, index) => {
    const isTotal = index === moneyRows.length - 1
    rows.push({
      cells: [
        { value: item.label, colSpan: 4, align: 'right', bold: isTotal, border: true, fill: isTotal ? TOTAL_FILL : undefined },
        { value: `${input.currency}`, align: 'center', bold: isTotal, border: true, fill: isTotal ? TOTAL_FILL : undefined },
        { value: item.value, align: 'right', bold: isTotal, border: true, decimals: 2, fill: isTotal ? TOTAL_FILL : undefined },
      ],
      height: isTotal ? 20 : 16,
    })
  })

  // 金额大写
  rows.push(fullRow(totals.totalInWordsEn, { bold: true, size: 10, border: true, wrap: true }))

  // 银行信息
  if (input.bankDetails && input.bankDetails.trim()) {
    rows.push(fullRow('BANK DETAILS', { bold: true, size: 10, border: true, fill: HEADER_FILL }))
    rows.push(fullRow(input.bankDetails, { size: 10, border: true, wrap: true }))
  }

  // 备注
  if (input.notes.length > 0) {
    rows.push(fullRow('NOTES', { bold: true, size: 10, border: true, fill: HEADER_FILL }))
    input.notes.forEach((note, index) => {
      rows.push(fullRow(`${index + 1}. ${note}`, { size: 10, border: true, wrap: true }))
    })
  }

  // 签字栏
  rows.push({
    cells: [
      { value: `For ${input.seller.name}`, colSpan: 3, size: 10, align: 'left' },
      { value: '', colSpan: 1 },
      { value: 'Authorized Signature', colSpan: 2, size: 10, align: 'right' },
    ],
    height: 34,
  })

  return {
    name: 'Invoice',
    columns: COLUMNS,
    rows,
    landscape: false,
  }
}

export const INVOICE_WORKBOOK_COLUMN_COUNT = LAST_COLUMN + 1
