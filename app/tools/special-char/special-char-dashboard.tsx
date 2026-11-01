// 名称: 特殊字符统计与历史
// 描述: 紧凑统计条与最近五次检查记录
// 路径: ExportBox/app/tools/special-char/special-char-dashboard.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { AlertCircle, CheckCircle, FileWarning, Search, Shield, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CheckHistoryItem } from './special-char-data'

export function SpecialCharStats({ history }: { history: CheckHistoryItem[] }) {
  const stats = [
    { label: '检查次数', value: String(history.length), note: '本次会话', icon: Search },
    { label: '发现问题', value: String(history.filter((item) => item.hasSpecial).length), note: '含特殊字符', icon: FileWarning },
    { label: '处理模式', value: '2', note: '种清理方式', icon: Shield },
    { label: '实时检测', value: '支持', note: '即时反馈', icon: Zap },
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

export function SpecialCharHistory({ history }: { history: CheckHistoryItem[] }) {
  if (history.length === 0) return null
  return (
    <Card>
      <CardHeader className="px-3 pt-2.5 pb-1.5">
        <CardTitle className="text-sm font-semibold">最近检查记录<span className="ml-1.5 text-[10px] font-normal text-muted-foreground">最多 5 条</span></CardTitle>
      </CardHeader>
      <CardContent className="px-3 pt-0 pb-3">
        <div className="divide-y">
          {history.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-2 py-1">
              <div className="flex min-w-0 items-center gap-1.5 text-[11px]">
                {item.hasSpecial ? <AlertCircle className="h-3.5 w-3.5 shrink-0 text-destructive" /> : <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-600" />}
                <span className="truncate">{item.hasSpecial ? `发现 ${item.charCount} 个特殊字符` : '无特殊字符'}</span>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{item.time}</span>
              </div>
              <Badge variant={item.hasSpecial ? 'destructive' : 'secondary'} className="h-4 shrink-0 px-1 text-[10px]">{item.hasSpecial ? '需处理' : '安全'}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
