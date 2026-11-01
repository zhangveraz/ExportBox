// 名称: 条码预览与下载
// 描述: 使用浏览器端编码器渲染条码并导出 PNG/SVG（单屏紧凑版）
// 路径: ExportBox/app/tools/barcode-generator/barcode-preview.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

'use client'

import { useEffect, useRef, useState } from 'react'
import { CircleAlert, Download, FileCode2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  formatBarcodeError,
  getBarcodeFormat,
  type BarcodeRenderRequest,
} from '@/lib/tools/barcode-generator'

interface BarcodePreviewProps {
  request: BarcodeRenderRequest
  inputError: string
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function BarcodePreview({ request, inputError }: BarcodePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [result, setResult] = useState<{ request: BarcodeRenderRequest; svg: string; error: string } | null>(null)
  const format = getBarcodeFormat(request.formatId)
  const loading = result?.request !== request
  const svg = loading ? '' : result?.svg ?? ''
  const renderError = loading ? '' : result?.error ?? ''
  const activeError = inputError || renderError
  const canDownload = !loading && !activeError && Boolean(svg)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    async function render() {
      try {
        const { renderBarcode } = await import('./barcode-renderer').catch(() => {
          throw new Error('条码编码器加载失败，请点击“生成条码”重试')
        })
        // 切换请求或卸载后，旧异步任务不可再绘制 canvas 或更新结果。
        if (cancelled || !canvas) return
        const nextSvg = renderBarcode(request, canvas)
        setResult({ request, svg: nextSvg, error: '' })
      } catch (caughtError) {
        if (cancelled) return
        if (canvas) { canvas.width = 1; canvas.height = 1 }
        setResult({ request, svg: '', error: formatBarcodeError(caughtError) })
      }
    }
    void render()
    return () => { cancelled = true }
  }, [request])

  function downloadPng() {
    const canvas = canvasRef.current
    if (!canvas || !canDownload) return
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `ExportBox-${request.formatId}.png`)
      else setResult((current) => current?.request === request
        ? { ...current, error: '浏览器未能生成 PNG 文件，请重新生成后尝试下载 SVG' }
        : current)
    }, 'image/png')
  }

  function downloadSvg() {
    if (!canDownload) return
    downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `ExportBox-${request.formatId}.svg`)
  }

  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
        <CardTitle className="text-sm font-semibold">生成结果</CardTitle>
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{format.label}</span>
          <span className="text-[10px] text-muted-foreground">白底 · 保留静区</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-3 pt-0 pb-3">
        <div
          aria-busy={loading}
          className="flex h-[300px] items-center justify-center overflow-hidden rounded-md border bg-white p-3"
        >
          <canvas
            ref={canvasRef}
            className={activeError || loading ? 'hidden' : 'h-auto max-h-full w-auto max-w-full'}
            aria-label={`${format.label} 条码预览`}
          />
          {activeError
            ? <p className="px-3 text-center text-[11px] text-slate-500">修正数据或重试后重新生成预览</p>
            : loading && <p role="status" className="text-[11px] text-slate-500">正在加载编码器并生成条码…</p>}
        </div>

        {!inputError && renderError && (
          <Alert variant="destructive" className="px-2 py-1">
            <CircleAlert className="h-3.5 w-3.5" />
            <AlertDescription className="text-[10px] leading-[17px]">{renderError}</AlertDescription>
          </Alert>
        )}

        {!inputError && (
          <div className="rounded-md border bg-muted/40 px-2 py-1">
            <p className="text-[10px] leading-4 text-muted-foreground">规范化编码内容</p>
            <p className="max-h-[44px] overflow-auto break-all font-mono text-[11px] leading-[17px]">{request.displayText}</p>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={downloadPng} disabled={!canDownload} className="h-7 text-[11px]">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            下载 PNG
          </Button>
          <Button type="button" variant="outline" onClick={downloadSvg} disabled={!canDownload} className="h-7 text-[11px]">
            <FileCode2 className="mr-1.5 h-3.5 w-3.5" />
            下载 SVG
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
