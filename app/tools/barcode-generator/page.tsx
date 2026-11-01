// 名称: 国际条码生成器
// 描述: 生成符合 GS1 数据规则及常见国际条码规范的 PNG/SVG 条码
// 路径: ExportBox/app/tools/barcode-generator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { ToolShell } from '@/components/tools/tool-shell'
import BarcodeGeneratorTool from './barcode-generator-tool'

const NOTES = [
  {
    title: 'GS1 26.0 数据规则',
    text: 'GS1 DataMatrix 采用 ISO/IEC 16022:2024 的 ECC 200 符号制和首位 FNC1，并校验 AI、日期及标识键。',
  },
  {
    title: '11 种常用格式',
    text: '覆盖 GS1 DataMatrix、GS1-128、QR、Data Matrix、Code 128/39、EAN、UPC、ITF-14 与 ISBN-13。',
  },
  {
    title: 'PNG 与 SVG 导出',
    text: '位图适合办公预览，SVG 适合继续排版；量产前仍应按打印材料和扫描环境做条码质量验证。',
  },
]

export default function BarcodeGeneratorPage() {
  return (
    <ToolShell
      title="国际条码生成器"
      description="本地生成 GS1 DataMatrix、GS1-128 及常用零售、物流和通用条码，支持 PNG / SVG 下载，数据只在当前浏览器编码。"
    >
      <div className="space-y-2.5">
        <BarcodeGeneratorTool />

        <details className="rounded-lg border bg-muted/30 px-3 py-1.5 text-[11px] leading-5">
          <summary className="cursor-pointer select-none font-medium text-muted-foreground">
            GS1 规范、11 种格式与下载说明
          </summary>
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            {NOTES.map((note) => (
              <div key={note.title} className="rounded-md border bg-background/60 px-2.5 py-1.5">
                <p className="text-[11px] font-semibold">{note.title}</p>
                <p className="mt-0.5 text-[10px] leading-[17px] text-muted-foreground">{note.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 border-t pt-2 text-[10px] leading-[17px] text-muted-foreground">
            生成图形不等于取得 GS1 编码授权：EAN / UPC / GTIN / SSCC 等号码应由企业合法分配或通过所在地 GS1 成员组织取得。页面依据{' '}
            <a className="font-medium text-primary underline-offset-4 hover:underline" href="https://ref.gs1.org/standards/genspecs/" target="_blank" rel="noopener noreferrer">
              GS1 General Specifications 26.0
            </a>{' '}
            与{' '}
            <a className="font-medium text-primary underline-offset-4 hover:underline" href="https://www.iso.org/standard/80926.html" target="_blank" rel="noopener noreferrer">
              ISO/IEC 16022:2024
            </a>{' '}
            生成数据和符号，但不能替代 ISO/IEC 15415:2024、15416:2025 等实体条码质量检测。
          </p>
        </details>
      </div>
    </ToolShell>
  )
}
