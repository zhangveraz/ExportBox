// 名称: 拼音工具信息面板
// 描述: 顶部紧凑统计条与可折叠的功能、场景、声调对比说明
// 路径: ExportBox/app/tools/pinyin/pinyin-info.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Globe, Hash, Info, Type, Zap } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function PinyinStats({ historyCount }: { historyCount: number }) {
  const stats = [
    { label: '转换次数', value: String(historyCount), note: '本次会话', icon: Type },
    { label: '声调格式', value: '3', note: '种模式', icon: Globe },
    { label: '识别准确', value: '高', note: '多音字优选', icon: Hash },
    { label: '批量处理', value: '支持', note: '长文本', icon: Zap },
  ]
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
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

const INFO_GROUPS = [
  { title: '功能特点', items: ['使用专业的 pinyin-pro 库，识别准确率高', '支持符号声调、数字声调、无声调三种格式', '自动处理多音字，选择最常用读音', '保留英文、数字和标点符号', '支持完整中文字符集，包括生僻字', '高性能转换，可处理大量文本'] },
  { title: '使用场景', items: ['中文学习和教学材料制作', '拼音输入法词库生成', '中文内容国际化处理', '语音合成前处理', 'SEO 优化 URL 生成', '数据库拼音索引建立'] },
]
const TONE_COMPARISONS = [
  ['无声调', 'ni hao shi jie', 'URL、文件名'],
  ['符号声调', 'nǐ hǎo shì jiè', '教学材料、出版物'],
  ['数字声调', 'ni3 hao3 shi4 jie4', '输入法、数据处理'],
]

export function PinyinInfo() {
  return (
    <details className="mt-3 rounded-lg border px-3 py-1.5 text-[11px] leading-5">
      <summary className="cursor-pointer list-none font-medium text-foreground/80">功能特点、使用场景与声调格式对比</summary>
      <div className="mt-1.5 space-y-2 border-t pt-2">
        <div className="grid gap-3 md:grid-cols-2">
          {INFO_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="flex items-center gap-1 pb-0.5 text-[11px] font-semibold text-foreground"><Info className="h-3.5 w-3.5" />{group.title}</p>
              <div className="space-y-0.5 text-muted-foreground">{group.items.map((item) => <p key={item}>· {item}</p>)}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-1 border-t pt-1.5 sm:grid-cols-3">
          {TONE_COMPARISONS.map(([title, example, note]) => (
            <div key={title} className="rounded-md bg-muted/40 px-2 py-1">
              <p className="text-[10px] text-muted-foreground">{title} · 适合{note}</p>
              <p className="font-mono text-[12px]">{example}</p>
            </div>
          ))}
        </div>
        <Alert className="px-2 py-1"><AlertDescription className="text-[10px] leading-4">示例原文「你好世界」：不同声调格式适用于不同使用场景。</AlertDescription></Alert>
      </div>
    </details>
  )
}
