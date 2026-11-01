// 名称: 文本转换信息面板
// 描述: 展示模式统计与可折叠的转换示例、使用说明
// 路径: ExportBox/app/tools/text-case/text-case-info.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Code, Info, Keyboard, RefreshCw, Type } from 'lucide-react'
import { convertCase } from '@/lib/tools/text-case'
import { CASE_OPTIONS } from './text-case-data'

export function TextCaseStats({ historyCount }: { historyCount: number }) {
  const stats = [
    { label: '转换模式', value: CASE_OPTIONS.length, note: '种格式', icon: Type },
    { label: '编程支持', value: '7+', note: '开发常用格式', icon: Code },
    { label: '历史记录', value: historyCount, note: '次转换', icon: RefreshCw },
  ]
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {stats.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.label} className="rounded-md bg-muted/50 px-2.5 py-1.5">
            <p className="flex items-center gap-1 truncate text-[10px] leading-4 text-muted-foreground"><Icon className="h-3 w-3 shrink-0" />{item.label}</p>
            <p className="text-[13px] font-semibold leading-5 tabular-nums">{item.value}<span className="ml-1 text-[10px] font-normal text-muted-foreground">{item.note}</span></p>
          </div>
        )
      })}
    </div>
  )
}

const INSTRUCTIONS = [
  ['多模式支持:', '内置 15 种转换算法，覆盖日常写作、编程开发与文件命名。'],
  ['文件名规范:', '「点连接命名」可识别 S01/HDTV 等关键词，一键生成规范文件名。'],
  ['开发者友好:', '支持驼峰（Camel）、下划线（Snake）等变量命名，自动识别单词边界。'],
  ['批量操作:', '支持多段文本混合输入，实时转换并保留原文本换行格式。'],
  ['快捷复用:', '自动记录最近 5 次转换结果，点击即可复制。'],
]

export function TextCaseInfo() {
  const demoText = 'hello world'
  return (
    <details className="mt-3 rounded-lg border px-3 py-1.5 text-[11px] leading-5">
      <summary className="cursor-pointer list-none font-medium text-foreground/80">转换示例与使用说明</summary>
      <div className="mt-1.5 grid gap-3 border-t pt-2 md:grid-cols-2">
        <div>
          <p className="flex items-center gap-1 pb-1 text-[11px] font-semibold text-foreground"><Info className="h-3.5 w-3.5" />转换示例</p>
          <div className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
            {CASE_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center justify-between gap-2 border-b py-0.5 text-[10px] last:border-0">
                <span className="w-24 shrink-0 truncate font-mono text-muted-foreground" title={option.shortLabel}>{option.shortLabel}</span>
                <span className="truncate font-mono">{demoText}</span>
                <span className="shrink-0 text-muted-foreground">→</span>
                <span className="truncate text-right font-mono font-medium">{convertCase(demoText, option.value)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="flex items-center gap-1 pb-1 text-[11px] font-semibold text-foreground"><Keyboard className="h-3.5 w-3.5" />使用说明</p>
          <div className="space-y-1 text-muted-foreground">
            {INSTRUCTIONS.map(([title, content]) => (
              <p key={title}><span className="font-medium text-foreground">{title}</span> {content}</p>
            ))}
          </div>
        </div>
      </div>
    </details>
  )
}
