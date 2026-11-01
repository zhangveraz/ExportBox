// 名称: YAML 与 JSON 互转工具页面
// 描述: 在浏览器本地完成 YAML 与 JSON 双向转换，展示结构统计、往返校验与错误行号
// 路径: ExportBox/app/tools/yaml-json-converter/page.tsx
// 作者: ExportBox
// 更新时间: 2026-09-18

'use client'

import { useMemo, useState } from 'react'
import { ArrowLeftRight, GitCompareArrows, RotateCcw, Shuffle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { EnhancedAlert } from '@/components/ui/enhanced-alert'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { MobileButtonGroup } from '@/components/tools/mobile-friendly-wrapper'
import { ToolShell } from '@/components/tools/tool-shell'
import { ScenarioPresets } from '@/components/tools/scenario-presets'
import { convertYamlJson } from '@/lib/tools/yaml-json-converter'
import {
  DEFAULT_YAML_JSON_FORM,
  JSON_SAMPLE,
  YAML_JSON_PRESETS,
  YAML_SAMPLE,
  buildYamlJsonSummary,
  getIndentValue,
  getJsonIndentValue,
  type YamlJsonFormState,
} from './yaml-json-page-data'

export default function YamlJsonConverterPage() {
  const [form, setForm] = useState<YamlJsonFormState>(DEFAULT_YAML_JSON_FORM)

  const update = <Key extends keyof YamlJsonFormState>(key: Key, value: YamlJsonFormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const applyPreset = (values: Partial<YamlJsonFormState>) => {
    setForm((current) => ({ ...current, ...values }))
  }

  const conversion = useMemo(
    () =>
      convertYamlJson(form.source, {
        mode: form.mode,
        indent: getIndentValue(form.indent),
        jsonIndent: getJsonIndentValue(form.jsonIndent),
        quoteStyle: form.quoteStyle,
        sortKeys: form.sortKeys,
      }),
    [form]
  )

  const summaryText = useMemo(() => (conversion.ok ? buildYamlJsonSummary(conversion, form) : ''), [conversion, form])

  const stats = [
    { label: '顶层节点', value: conversion.stats.topLevelCount },
    { label: '标量节点', value: conversion.stats.scalarCount },
    { label: '最大层级', value: conversion.stats.maxDepth },
    { label: '输出行数', value: conversion.stats.outputLines },
  ]

  const isYamlInput = form.mode === 'yaml-to-json'

  return (
    <ToolShell title="YAML 与 JSON 互转" description="把缩进式 YAML 转成 JSON，或把 JSON 转成 YAML，支持缩进宽度、引号风格与键排序，并给出结构与往返校验结果。">
      

      <ScenarioPresets presets={YAML_JSON_PRESETS} onSelect={applyPreset} />

      {conversion.error && (
        <EnhancedAlert
          type="error"
          title="转换失败"
          message={
            conversion.error + (conversion.errorLine ? '（第 ' + conversion.errorLine + ' 行）' : '')
          }
          action={{ label: '载入示例', onClick: () => applyPreset({ source: isYamlInput ? YAML_SAMPLE : JSON_SAMPLE }) }}
          className="mt-2.5"
        />
      )}

      <div className="mt-2.5 grid gap-3 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              待转换内容
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button type="button" size="sm" variant={isYamlInput ? 'default' : 'outline'} onClick={() => update('mode', 'yaml-to-json')} className="h-6 px-2 text-[11px]">YAML → JSON</Button>
              <Button type="button" size="sm" variant={isYamlInput ? 'outline' : 'default'} onClick={() => update('mode', 'json-to-yaml')} className="h-6 px-2 text-[11px]">JSON → YAML</Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => update('source', isYamlInput ? JSON_SAMPLE : YAML_SAMPLE)} className="h-6 px-1.5 text-[11px]">
                <Shuffle className="mr-1 h-3 w-3" />示例
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 px-3 pt-0 pb-3">
            <Textarea
              id="yaml-json-source"
              aria-label={isYamlInput ? 'YAML 输入' : 'JSON 输入'}
              value={form.source}
              onChange={(event) => update('source', event.target.value)}
              spellCheck={false}
              className="min-h-[260px] font-mono text-[12px] leading-5"
            />

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="yaml-json-indent" className="text-[10px] font-medium leading-4">YAML 缩进</Label>
                <Select value={form.indent} onValueChange={(value) => update('indent', value as YamlJsonFormState['indent'])}>
                  <SelectTrigger id="yaml-json-indent" className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 个空格</SelectItem>
                    <SelectItem value="4">4 个空格</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="yaml-json-json-indent" className="text-[10px] font-medium leading-4">JSON 缩进</Label>
                <Select value={form.jsonIndent} onValueChange={(value) => update('jsonIndent', value as YamlJsonFormState['jsonIndent'])}>
                  <SelectTrigger id="yaml-json-json-indent" className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 个空格</SelectItem>
                    <SelectItem value="4">4 个空格</SelectItem>
                    <SelectItem value="0">紧凑（单行）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="yaml-json-quote" className="text-[10px] font-medium leading-4">YAML 字符串引号</Label>
                <Select value={form.quoteStyle} onValueChange={(value) => update('quoteStyle', value as YamlJsonFormState['quoteStyle'])}>
                  <SelectTrigger id="yaml-json-quote" className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">自动判断</SelectItem>
                    <SelectItem value="single">全部单引号</SelectItem>
                    <SelectItem value="double">全部双引号</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="yaml-json-sort" className="text-[10px] font-medium leading-4">键排序</Label>
                <Select value={form.sortKeys ? 'on' : 'off'} onValueChange={(value) => update('sortKeys', value === 'on')}>
                  <SelectTrigger id="yaml-json-sort" className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">保持原有顺序</SelectItem>
                    <SelectItem value="on">按字典序排列</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <MobileButtonGroup>
              <Button type="button" variant="outline" onClick={() => setForm(DEFAULT_YAML_JSON_FORM)} className="h-7 px-2 text-[11px]">
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                重置为默认
              </Button>
            </MobileButtonGroup>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
              <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
                <GitCompareArrows className="h-3.5 w-3.5" />
                转换结果
              </CardTitle>
              {conversion.ok && (
                <Badge variant={conversion.roundTripOk ? 'default' : 'outline'} className="h-5 shrink-0 text-[10px]">
                  {conversion.roundTripOk ? '往返校验通过' : '往返需复核'}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-2 px-3 pt-0 pb-3">
              <div className="grid grid-cols-4 gap-1.5">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-md bg-muted/50 px-2 py-1">
                    <p className="truncate text-[10px] leading-4 text-muted-foreground">{stat.label}</p>
                    <p className="font-mono text-[13px] font-semibold leading-5 tabular-nums">{stat.value}</p>
                  </div>
                ))}
              </div>

              {conversion.ok ? (
                <>
                  <Textarea
                    aria-label="转换输出"
                    value={conversion.output}
                    readOnly
                    spellCheck={false}
                    className="min-h-[240px] font-mono text-[12px] leading-5"
                  />
                  <MobileButtonGroup>
                    <EnhancedCopyButton text={conversion.output} className="h-7 px-2 text-[11px]">复制结果</EnhancedCopyButton>
                    <EnhancedCopyButton text={summaryText} variant="outline" className="h-7 px-2 text-[11px]">复制摘要</EnhancedCopyButton>
                  </MobileButtonGroup>
                </>
              ) : (
                <div className="rounded-md border border-dashed p-5 text-center text-[11px] text-muted-foreground">
                  修正输入后查看转换结果
                </div>
              )}
            </CardContent>
          </Card>

          <details className="rounded-lg border px-3 py-1.5 text-[11px] leading-5 text-muted-foreground">
            <summary className="cursor-pointer list-none text-[11px] font-medium text-foreground/80">本地处理说明与支持语法</summary>
            <div className="mt-1 space-y-0.5 border-t pt-1.5">
              <p>转换完全在本机浏览器执行，内容不会上传到服务器。</p>
              <p>支持块映射、块序列、引号字符串、行尾注释、行内 [] 与 {'{}'} 集合，以及 | 与 &gt; 块标量。</p>
              <p>锚点取内联值、别名以 $ref 标注；自定义标签（!Tag）不在支持范围内。</p>
            </div>
          </details>
        </div>
      </div>
    </ToolShell>
  )
}
