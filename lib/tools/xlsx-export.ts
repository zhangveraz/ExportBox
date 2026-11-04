// 名称: 轻量 Excel(.xlsx) 导出器
// 描述: 不依赖任何第三方库，把「表格数据 + 样式」打包成标准的 xlsx 文件，支持合并单元格、列宽、行高、边框、加粗、对齐与浅底色
// 路径: ExportBox/lib/tools/xlsx-export.ts
// 作者: ExportBox
// 更新时间: 2026-11-03

export interface XlsxCellStyle {
  /** 加粗 */
  bold?: boolean
  /** 字号，默认 11 */
  size?: number
  /** 水平对齐，默认左对齐 */
  align?: 'left' | 'center' | 'right'
  /** 是否有细边框 */
  border?: boolean
  /** 背景色，6 位十六进制，例如 'F1F5F9' */
  fill?: string
  /** 自动换行 */
  wrap?: boolean
  /** 数字保留几位小数（不传则当普通文本/整数处理） */
  decimals?: number
}

export interface XlsxCell extends XlsxCellStyle {
  value: string | number
  /** 横向合并几格（默认 1） */
  colSpan?: number
}

export interface XlsxRow {
  /** 每格内容，null 表示这一格留空 */
  cells: (XlsxCell | null)[]
  /** 行高（磅），不传用默认 */
  height?: number
}

export interface XlsxSheet {
  /** 工作表名，默认「Sheet1」 */
  name?: string
  /** 每一列的宽度（单位是「字符数」），个数要和表格列数一致 */
  columns: number[]
  rows: XlsxRow[]
  /** 横向打印（默认纵向） */
  landscape?: boolean
}

interface ResolvedStyle {
  bold: boolean
  size: number
  align: 'left' | 'center' | 'right'
  border: boolean
  fill: string
  wrap: boolean
  decimals: number
}

const DEFAULT_STYLE: ResolvedStyle = {
  bold: false,
  size: 11,
  align: 'left',
  border: false,
  fill: '',
  wrap: false,
  decimals: 0,
}

function escapeXml(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function resolveStyle(cell: XlsxCell): ResolvedStyle {
  return {
    bold: cell.bold ?? DEFAULT_STYLE.bold,
    size: cell.size ?? DEFAULT_STYLE.size,
    align: cell.align ?? DEFAULT_STYLE.align,
    border: cell.border ?? DEFAULT_STYLE.border,
    fill: (cell.fill ?? DEFAULT_STYLE.fill).toUpperCase(),
    wrap: cell.wrap ?? DEFAULT_STYLE.wrap,
    decimals: cell.decimals ?? DEFAULT_STYLE.decimals,
  }
}

function styleKey(style: ResolvedStyle): string {
  return [style.bold, style.size, style.align, style.border, style.fill, style.wrap, style.decimals].join('|')
}

function columnLetter(index: number): string {
  let rest = index + 1
  let letters = ''
  while (rest > 0) {
    const remainder = (rest - 1) % 26
    letters = String.fromCharCode(65 + remainder) + letters
    rest = Math.floor((rest - 1) / 26)
  }
  return letters
}

/** 把样式表转成 styles.xml；返回每格用到的样式编号映射 */
function buildStyles(styles: ResolvedStyle[]): { xml: string; indexByKey: Map<string, number> } {
  const indexByKey = new Map<string, number>()

  const fonts: { bold: boolean; size: number }[] = [{ bold: false, size: 11 }]
  const fills: string[] = []
  const numFormats: { id: number; code: string }[] = []
  const xfs: string[] = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>']

  const fontKey = (bold: boolean, size: number) => `${bold ? 1 : 0}|${size}`
  const fontIndex = new Map<string, number>([[fontKey(false, 11), 0]])
  const fillIndex = new Map<string, number>()
  const numFormatIndex = new Map<number, number>()

  styles.forEach((style) => {
    const key = styleKey(style)
    if (indexByKey.has(key)) return
    indexByKey.set(key, xfs.length)

    const fKey = fontKey(style.bold, style.size)
    let fontId = fontIndex.get(fKey)
    if (fontId === undefined) {
      fontId = fonts.length
      fonts.push({ bold: style.bold, size: style.size })
      fontIndex.set(fKey, fontId)
    }

    let fillId = 0
    if (style.fill) {
      const existed = fillIndex.get(style.fill)
      if (existed === undefined) {
        fillId = 2 + fills.length
        fills.push(style.fill)
        fillIndex.set(style.fill, fillId)
      } else {
        fillId = existed
      }
    }

    let numFmtId = 0
    if (style.decimals > 0) {
      const existed = numFormatIndex.get(style.decimals)
      if (existed === undefined) {
        if (style.decimals >= 4) {
          numFmtId = 165
          if (!numFormats.some((item) => item.id === 165)) numFormats.push({ id: 165, code: '#,##0.0000' })
        } else if (style.decimals >= 3) {
          numFmtId = 166
          if (!numFormats.some((item) => item.id === 166)) numFormats.push({ id: 166, code: '#,##0.000' })
        } else if (style.decimals >= 2) {
          numFmtId = 164
          if (!numFormats.some((item) => item.id === 164)) numFormats.push({ id: 164, code: '#,##0.00' })
        } else {
          numFmtId = 167
          if (!numFormats.some((item) => item.id === 167)) numFormats.push({ id: 167, code: '#,##0.0' })
        }
        numFormatIndex.set(style.decimals, numFmtId)
      } else {
        numFmtId = existed
      }
    }

    const alignment = [
      `horizontal="${style.align}"`,
      'vertical="center"',
      style.wrap ? 'wrapText="1"' : '',
    ]
      .filter(Boolean)
      .join(' ')

    xfs.push(
      `<xf numFmtId="${numFmtId}" fontId="${fontId}" fillId="${fillId}" borderId="${style.border ? 1 : 0}" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1" applyNumberFormat="1"><alignment ${alignment}/></xf>`
    )
  })

  const fontXml = fonts
    .map(
      (font) =>
        `<font><sz val="${font.size}"/><name val="Calibri"/>${font.bold ? '<b/>' : ''}</font>`
    )
    .join('')

  const fillXml = [
    '<fill><patternFill patternType="none"/></fill>',
    '<fill><patternFill patternType="gray125"/></fill>',
    ...fills.map(
      (color) => `<fill><patternFill patternType="solid"><fgColor rgb="FF${color}"/><bgColor indexed="64"/></patternFill></fill>`
    ),
  ].join('')

  const borderXml = [
    '<border><left/><right/><top/><bottom/><diagonal/></border>',
    '<border><left style="thin"><color rgb="FF94A3B8"/></left><right style="thin"><color rgb="FF94A3B8"/></right><top style="thin"><color rgb="FF94A3B8"/></top><bottom style="thin"><color rgb="FF94A3B8"/></bottom><diagonal/></border>',
  ].join('')

  const numFmtXml = numFormats
    .map((item) => `<numFmt numFmtId="${item.id}" formatCode="${escapeXml(item.code)}"/>`)
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${
    numFmtXml ? `<numFmts count="${numFormats.length}">${numFmtXml}</numFmts>` : ''
  }<fonts count="${fonts.length}">${fontXml}</fonts><fills count="${fillXml ? 2 + fills.length : 2}">${fillXml}</fills><borders count="2">${borderXml}</borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${xfs.length}">${xfs.join(
    ''
  )}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`

  return { xml, indexByKey }
}

function buildSheetXml(sheet: XlsxSheet): { worksheetXml: string; stylesXml: string } {
  const allCells: XlsxCell[] = []
  for (const row of sheet.rows) {
    for (const cell of row.cells) {
      if (cell) allCells.push(cell)
    }
  }

  const { xml: stylesXml, indexByKey } = buildStyles(allCells.map(resolveStyle))

  const merges: string[] = []
  const rowsXml = sheet.rows
    .map((row, rowIndex) => {
      const rowNumber = rowIndex + 1
      const cellsXml = row.cells
        .map((cell, columnIndex) => {
          if (!cell) return ''
          const styleId = indexByKey.get(styleKey(resolveStyle(cell))) ?? 0
          const ref = `${columnLetter(columnIndex)}${rowNumber}`
          const span = cell.colSpan && cell.colSpan > 1 ? cell.colSpan : 1
          if (span > 1) {
            merges.push(`${ref}:${columnLetter(columnIndex + span - 1)}${rowNumber}`)
          }
          if (typeof cell.value === 'number' && Number.isFinite(cell.value)) {
            return `<c r="${ref}" s="${styleId}"><v>${cell.value}</v></c>`
          }
          return `<c r="${ref}" s="${styleId}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(String(cell.value))}</t></is></c>`
        })
        .join('')

      const height = row.height ? ` ht="${row.height}" customHeight="1"` : ''
      return `<row r="${rowNumber}"${height}>${cellsXml}</row>`
    })
    .join('')

  const maxColumns = Math.max(1, ...sheet.rows.map((row) => row.cells.length))
  const lastRow = Math.max(1, sheet.rows.length)
  const dimension = `A1:${columnLetter(maxColumns - 1)}${lastRow}`

  const colsXml = sheet.columns
    .map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`)
    .join('')

  const mergeXml = merges.length
    ? `<mergeCells count="${merges.length}">${merges.map((ref) => `<mergeCell ref="${ref}"/>`).join('')}</mergeCells>`
    : ''

  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><dimension ref="${dimension}"/><sheetViews><sheetView showGridLines="0" workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols>${colsXml}</cols><sheetData>${rowsXml}</sheetData>${mergeXml}<printOptions horizontalCentered="1"/><pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup paperSize="9" orientation="${
    sheet.landscape ? 'landscape' : 'portrait'
  }" fitToWidth="1" fitToHeight="0"/></worksheet>`

  return { worksheetXml: xml, stylesXml }
}

const CRC_TABLE: number[] = (() => {
  const table: number[] = []
  for (let index = 0; index < 256; index += 1) {
    let value = index
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
    }
    table.push(value >>> 0)
  }
  return table
})()

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (let index = 0; index < bytes.length; index += 1) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[index]) & 0xff]
  }
  return (crc ^ 0xffffffff) >>> 0
}

interface ZipEntry {
  name: string
  data: Uint8Array
}

/** 只做「存储」不压缩的 zip 打包：xlsx 本质就是一个 zip */
function zipStore(entries: ZipEntry[]): Uint8Array {
  const encoder = new TextEncoder()
  const chunks: Uint8Array[] = []
  const central: Uint8Array[] = []
  let offset = 0

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name)
    const crc = crc32(entry.data)
    const local = new Uint8Array(30 + nameBytes.length)
    const view = new DataView(local.buffer)
    view.setUint32(0, 0x04034b50, true)
    view.setUint16(4, 20, true)
    view.setUint16(6, 0x0800, true)
    view.setUint16(8, 0, true)
    view.setUint16(10, 0, true)
    view.setUint16(12, 0x21, true)
    view.setUint32(14, crc, true)
    view.setUint32(18, entry.data.length, true)
    view.setUint32(22, entry.data.length, true)
    view.setUint16(26, nameBytes.length, true)
    view.setUint16(28, 0, true)
    local.set(nameBytes, 30)

    chunks.push(local, entry.data)

    const centralEntry = new Uint8Array(46 + nameBytes.length)
    const centralView = new DataView(centralEntry.buffer)
    centralView.setUint32(0, 0x02014b50, true)
    centralView.setUint16(4, 20, true)
    centralView.setUint16(6, 20, true)
    centralView.setUint16(8, 0x0800, true)
    centralView.setUint16(10, 0, true)
    centralView.setUint16(12, 0, true)
    centralView.setUint16(14, 0x21, true)
    centralView.setUint32(16, crc, true)
    centralView.setUint32(20, entry.data.length, true)
    centralView.setUint32(24, entry.data.length, true)
    centralView.setUint16(28, nameBytes.length, true)
    centralView.setUint16(30, 0, true)
    centralView.setUint16(32, 0, true)
    centralView.setUint16(34, 0, true)
    centralView.setUint16(36, 0, true)
    centralView.setUint32(38, 0, true)
    centralView.setUint32(42, offset, true)
    centralEntry.set(nameBytes, 46)
    central.push(centralEntry)

    offset += local.length + entry.data.length
  }

  const centralSize = central.reduce((total, item) => total + item.length, 0)
  const end = new Uint8Array(22)
  const endView = new DataView(end.buffer)
  endView.setUint32(0, 0x06054b50, true)
  endView.setUint16(4, 0, true)
  endView.setUint16(6, 0, true)
  endView.setUint16(8, entries.length, true)
  endView.setUint16(10, entries.length, true)
  endView.setUint32(12, centralSize, true)
  endView.setUint32(16, offset, true)
  endView.setUint16(20, 0, true)

  const parts = [...chunks, ...central, end]
  const totalLength = parts.reduce((total, item) => total + item.length, 0)
  const output = new Uint8Array(totalLength)
  let cursor = 0
  for (const part of parts) {
    output.set(part, cursor)
    cursor += part.length
  }
  return output
}

/** 生成 xlsx 文件（Blob），可直接交给下载逻辑 */
export function buildXlsxBlob(sheet: XlsxSheet): Blob {
  const encoder = new TextEncoder()
  const sheetName = (sheet.name || 'Sheet1').replace(/[\\/?*[\]:]/g, ' ').slice(0, 31) || 'Sheet1'
  const { worksheetXml, stylesXml } = buildSheetXml(sheet)

  const entries: ZipEntry[] = [
    {
      name: '[Content_Types].xml',
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`
      ),
    },
    {
      name: '_rels/.rels',
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`
      ),
    },
    {
      name: 'xl/workbook.xml',
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${escapeXml(
          sheetName
        )}" sheetId="1" r:id="rId1"/></sheets></workbook>`
      ),
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`
      ),
    },
    { name: 'xl/worksheets/sheet1.xml', data: encoder.encode(worksheetXml) },
    { name: 'xl/styles.xml', data: encoder.encode(stylesXml) },
  ]

  return new Blob([zipStore(entries).buffer as ArrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

/** 触发浏览器下载 */
export function downloadXlsx(sheet: XlsxSheet, filename: string): void {
  const blob = buildXlsxBlob(sheet)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
