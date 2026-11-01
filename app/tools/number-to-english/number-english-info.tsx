// 名称: 数字转英文信息面板
// 描述: 展示统计、示例、使用场景和单位对照（紧凑版）
// 路径: ExportBox/app/tools/number-to-english/number-english-info.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Calculator, Hash, Info, Type } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NUMBER_EXAMPLES } from './number-english-data'

export function NumberEnglishStats({ historyCount }: { historyCount: number }) {
  const stats = [
    { label: '转换次数', value: String(historyCount), note: '今日', icon: Calculator },
    { label: '支持范围', value: '12位', note: '最大数字', icon: Hash },
    { label: '转换模式', value: '2', note: '种格式', icon: Type },
  ]
  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((item) => {
        const Icon = item.icon
        return <div key={item.label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5">
          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="truncate text-[10px] leading-3 text-muted-foreground">{item.label}</p>
            <p className="text-[13px] leading-5 font-semibold">{item.value}<span className="ml-1 text-[10px] font-normal text-muted-foreground">{item.note}</span></p>
          </div>
        </div>
      })}
    </div>
  )
}

const USAGE = ['支票金额的英文大写', '合同中的数字表述', '正式文件的数字说明', '英文邮件中的数字表达', '财务报表的英文版本', '国际贸易单据填写']
const NOTES = ['基数词用于表示数量', '序数词用于表示顺序或排名', '英式英语在百位后通常加“and”', '支持 0-999,999,999,999 的数字']
const UNITS = [
  ['1-19', 'one, two, three...'], ['20-90', 'twenty, thirty, forty...'], ['100', 'hundred'], ['1,000', 'thousand'],
  ['1,000,000', 'million'], ['1,000,000,000', 'billion'], ['序数词后缀', '-st, -nd, -rd, -th'], ['特殊序数', 'first, second, third'],
]

export function NumberEnglishInfo() {
  return (
    <details className="group mt-3 rounded-lg border bg-muted/40 px-3 py-2">
      <summary className="flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-slate-700 dark:text-slate-200">
        <Info className="h-3.5 w-3.5" />示例、使用场景与单位对照
        <span className="ml-auto text-[11px] font-normal text-muted-foreground group-open:hidden">展开</span>
      </summary>
      <div className="mt-2 grid gap-3 lg:grid-cols-3">
        <Card className="gap-0 py-0">
          <CardHeader className="px-2.5 pt-2 pb-1"><CardTitle className="text-[12px] font-semibold">常见示例</CardTitle></CardHeader>
          <CardContent className="divide-y divide-border/70 px-2.5 pt-0 pb-1.5">
            {NUMBER_EXAMPLES.map((example) => (
              <div key={example.num} className="py-1 text-[11px] leading-4">
                <p className="font-mono font-semibold tabular-nums">{example.num}</p>
                <p className="line-clamp-1 text-muted-foreground" title={example.cardinal}>基数：{example.cardinal}</p>
                <p className="line-clamp-1 text-muted-foreground" title={example.ordinal}>序数：{example.ordinal}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="space-y-2">
          <InfoList title="使用场景" items={USAGE} />
          <InfoList title="注意事项" items={NOTES} />
        </div>
        <Card className="gap-0 py-0">
          <CardHeader className="px-2.5 pt-2 pb-1"><CardTitle className="text-[12px] font-semibold">英文数字单位对照</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-2 gap-y-1 px-2.5 pt-0 pb-1.5 text-[11px] leading-4">
            {UNITS.map(([unit, english]) => <div key={unit} className="min-w-0"><p className="font-medium">{unit}</p><p className="truncate text-muted-foreground" title={english}>{english}</p></div>)}
          </CardContent>
        </Card>
      </div>
    </details>
  )
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-2.5 pt-2 pb-1"><CardTitle className="text-[12px] font-semibold">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-0.5 px-2.5 pt-0 pb-1.5 text-[11px] leading-4 text-muted-foreground">{items.map((item) => <p key={item}>• {item}</p>)}</CardContent>
    </Card>
  )
}
