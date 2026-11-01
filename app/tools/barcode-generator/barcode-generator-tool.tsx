// 名称: 国际条码生成器交互入口
// 描述: 管理条码类型、输入数据、清晰度与生成请求状态
// 路径: ExportBox/app/tools/barcode-generator/barcode-generator-tool.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

'use client'

import { useState } from 'react'
import BarcodeControls from './barcode-controls'
import BarcodePreview from './barcode-preview'
import {
  getBarcodeFormat,
  prepareBarcodeData,
  type BarcodeFormatId,
  type BarcodeRenderRequest,
  type BarcodeScale,
} from '@/lib/tools/barcode-generator'

const INITIAL_FORMAT: BarcodeFormatId = 'gs1datamatrix'
const INITIAL_INPUT = getBarcodeFormat(INITIAL_FORMAT).example
const INITIAL_DATA = prepareBarcodeData(INITIAL_FORMAT, INITIAL_INPUT)

export default function BarcodeGeneratorTool() {
  const [formatId, setFormatId] = useState<BarcodeFormatId>(INITIAL_FORMAT)
  const [input, setInput] = useState(INITIAL_INPUT)
  const [scale, setScale] = useState<BarcodeScale>(3)
  const [error, setError] = useState('')
  const [request, setRequest] = useState<BarcodeRenderRequest>({
    formatId: INITIAL_FORMAT,
    scale: 3,
    revision: 0,
    ...INITIAL_DATA,
  })

  const format = getBarcodeFormat(formatId)

  function handleFormatChange(nextFormatId: BarcodeFormatId) {
    setFormatId(nextFormatId)
    setInput(getBarcodeFormat(nextFormatId).example)
    setError('')
  }

  function handleGenerate() {
    try {
      const prepared = prepareBarcodeData(formatId, input)
      setRequest((current) => ({
        formatId,
        scale,
        revision: current.revision + 1,
        ...prepared,
      }))
      setError('')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : '输入数据无效')
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <Cell label="当前格式" value={format.label} note={format.isGs1 ? 'GS1 规范' : '通用条码'} />
        <Cell label="编码数据" value={`${input.length} 字符`} note={format.numericOnly ? '仅数字' : '含字符'} />
        <Cell label="输出清晰度" value={`${scale}x`} note={scale === 4 ? '印刷预览' : '屏幕预览'} />
        <Cell label="状态" value={error ? '待修正' : '就绪'} note={error ? '看左侧提示' : '可下载 PNG / SVG'} />
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
        <BarcodeControls
          formatId={formatId}
          input={input}
          scale={scale}
          error={error}
          onFormatChange={handleFormatChange}
          onInputChange={setInput}
          onScaleChange={setScale}
          onGenerate={handleGenerate}
        />
        <BarcodePreview request={request} inputError={error} />
      </div>
    </div>
  )
}

function Cell({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
      <p className="truncate text-[10px] leading-4 text-muted-foreground">{label}</p>
      <p className="truncate text-[13px] font-semibold leading-5" title={value}>{value}</p>
      <p className="truncate text-[10px] leading-4 text-muted-foreground">{note}</p>
    </div>
  )
}
