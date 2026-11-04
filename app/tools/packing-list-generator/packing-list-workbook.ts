// 名称: 装箱单 Excel 版式
// 描述: 把装箱单数据排成与 A4 预览一致的表格，供「导出 Excel」下载
// 路径: ExportBox/app/tools/packing-list-generator/packing-list-workbook.ts
// 作者: ExportBox
// 更新时间: 2026-11-03

import type { PackingListTotals } from '@/lib/tools/packing-list-generator'
import type { XlsxCell, XlsxRow, XlsxSheet } from '@/lib/tools/xlsx-export'

const COLUMNS = [6, 46, 10, 16, 12, 12, 12]

const HEADER_FILL = 'F1F5F9'
const TOTAL_FILL = 'E2E8F0'

export interface PackingListWorkbookHeader {
  exporter: string
  consignee: string
  invoiceNo: string
  date: string
  vessel: string
  containerNo: string
  portOfLoading: string
  portOfDischarge: string
  marks: string
  notes: string
}

function fullRow(value: string, cell: Omit<XlsxCell, 'value'> = {}): XlsxRow {
  return { cells: [{ value, colSpan: COLUMNS.length, border: true, ...cell }] }
}

function labelRow(label: string, value: string, height = 18): XlsxRow {
  return {
    cells: [
      { value: label, bold: true, size: 10, border: true },
      { value: value || '--', colSpan: COLUMNS.length - 1, size: 10, wrap: true, border: true },
    ],
    height,
  }
}

/** 生成装箱单的 Excel 版式 */
export function buildPackingListWorkbook(totals: PackingListTotals, header: PackingListWorkbookHeader): XlsxSheet {
  const rows: XlsxRow[] = []

  rows.push({
    cells: [{ value: 'PACKING LIST', colSpan: COLUMNS.length, bold: true, size: 16, align: 'center' }],
    height: 28,
  })

  rows.push({
    cells: [
      {
        value: `INVOICE NO.: ${header.invoiceNo}    DATE: ${header.date}`,
        colSpan: COLUMNS.length,
        size: 10,
        align: 'center',
      },
    ],
    height: 18,
  })

  rows.push(labelRow('EXPORTER', header.exporter, Math.max(18, header.exporter.split('\n').length * 15)))
  rows.push(labelRow('CONSIGNEE', header.consignee, Math.max(18, header.consignee.split('\n').length * 15)))
  rows.push(labelRow('VESSEL / VOYAGE', [header.vessel, header.containerNo].filter(Boolean).join('  ·  ')))
  rows.push(labelRow('PORTS', `${header.portOfLoading} → ${header.portOfDischarge}`))

  // 明细表头
  rows.push({
    cells: [
      { value: 'No.', bold: true, align: 'center', border: true, fill: HEADER_FILL },
      { value: 'Description', bold: true, border: true, fill: HEADER_FILL },
      { value: 'CTNS', bold: true, align: 'right', border: true, fill: HEADER_FILL },
      { value: 'Qty', bold: true, align: 'right', border: true, fill: HEADER_FILL },
      { value: 'G.W. (KG)', bold: true, align: 'right', border: true, fill: HEADER_FILL },
      { value: 'N.W. (KG)', bold: true, align: 'right', border: true, fill: HEADER_FILL },
      { value: 'CBM', bold: true, align: 'right', border: true, fill: HEADER_FILL },
    ],
    height: 20,
  })

  totals.lines.forEach((line, index) => {
    const description = [line.description, line.dimensionsLabel ? `${line.dimensionsLabel} · ${line.qtyPerCarton} ${line.unit}/ctn` : '']
      .filter(Boolean)
      .join('\n')
    rows.push({
      cells: [
        { value: index + 1, align: 'center', border: true },
        { value: description, border: true, wrap: true },
        { value: line.cartons, align: 'right', border: true },
        { value: `${line.qtyTotal} ${line.unit}`, align: 'right', border: true },
        { value: line.gwTotal, align: 'right', border: true, decimals: 2 },
        { value: line.nwTotal, align: 'right', border: true, decimals: 2 },
        { value: line.cbm ?? 0, align: 'right', border: true, decimals: 4 },
      ],
      height: 18,
    })
  })

  rows.push({
    cells: [
      { value: 'TOTAL', colSpan: 2, bold: true, border: true, fill: TOTAL_FILL },
      { value: totals.totalCartons, align: 'right', bold: true, border: true, fill: TOTAL_FILL },
      { value: totals.totalQty, align: 'right', bold: true, border: true, fill: TOTAL_FILL },
      { value: totals.totalGw, align: 'right', bold: true, border: true, decimals: 2, fill: TOTAL_FILL },
      { value: totals.totalNw, align: 'right', bold: true, border: true, decimals: 2, fill: TOTAL_FILL },
      { value: totals.totalCbm, align: 'right', bold: true, border: true, decimals: 4, fill: TOTAL_FILL },
    ],
    height: 20,
  })

  if (header.marks && header.marks.trim()) {
    rows.push(fullRow('SHIPPING MARKS', { bold: true, size: 10, fill: HEADER_FILL }))
    rows.push(fullRow(header.marks, { size: 10, wrap: true }))
  }

  if (header.notes && header.notes.trim()) {
    rows.push(fullRow(`NOTE: ${header.notes}`, { size: 10, wrap: true }))
  }

  rows.push({
    cells: [
      { value: `For ${header.exporter}`, colSpan: 3, size: 10 },
      { value: '', colSpan: 2 },
      { value: 'Authorized Signature', colSpan: 2, size: 10, align: 'right' },
    ],
    height: 34,
  })

  return {
    name: 'Packing List',
    columns: COLUMNS,
    rows,
    landscape: false,
  }
}
