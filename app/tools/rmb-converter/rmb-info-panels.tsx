// 名称: 人民币转换信息面板
// 描述: 展示转换统计、示例和使用说明（紧凑版）
// 路径: ExportBox/app/tools/rmb-converter/rmb-info-panels.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Calculator, Info, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RmbStats({ historyCount }: { historyCount: number }) {
  const items = [
    { icon: Calculator, label: '今日转换', value: String(historyCount), unit: '次记录' },
    { icon: TrendingUp, label: '支持范围', value: '千万亿', unit: '最大单位' },
    { icon: Info, label: '精确度', value: '0.01', unit: '支持到分' },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(({ icon: Icon, label, value, unit }) => (
        <div key={label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5">
          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="truncate text-[10px] leading-3 text-muted-foreground">{label}</p>
            <p className="text-[13px] leading-5 font-semibold">
              {value}
              <span className="ml-1 text-[10px] font-normal text-muted-foreground">{unit}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

const EXAMPLES = [
  ['123.45', '人民币壹佰贰拾叁元肆角伍分'],
  ['10000', '人民币壹万元整'],
  ['50000.5', '人民币伍万元伍角'],
  ['999999.99', '人民币玖拾玖万玖仟玖佰玖拾玖元玖角玖分'],
]

export function RmbReference() {
  return (
    <div className="mt-3 grid gap-3 lg:grid-cols-2">
      <Card className="gap-0 bg-muted/40 py-0">
        <CardHeader className="px-3 pt-2.5 pb-1">
          <CardTitle className="flex items-center gap-1.5 text-[13px] font-semibold">
            <Info className="h-3.5 w-3.5" />
            转换示例
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border/70 px-3 pt-0 pb-2">
          {EXAMPLES.map(([amount, result]) => (
            <div key={amount} className="flex items-baseline gap-2 py-1 text-[11px]">
              <span className="shrink-0 font-mono tabular-nums text-muted-foreground">{amount}</span>
              <span className="shrink-0 text-muted-foreground/60">→</span>
              <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-200" title={result}>{result}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="gap-0 bg-muted/40 py-0">
        <CardHeader className="px-3 pt-2.5 pb-1">
          <CardTitle className="flex items-center gap-1.5 text-[13px] font-semibold">
            <Info className="h-3.5 w-3.5" />
            使用说明
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-0 pb-2">
          <ul className="space-y-0.5 text-[11px] leading-4 text-muted-foreground">
            <li>• 支持小数点后两位（角、分）</li>
            <li>• 最大支持千万亿级别的金额</li>
            <li>• 自动添加“人民币”前缀和“元整 / 元X角X分”后缀</li>
            <li>• 符合财务规范的大写格式</li>
            <li>• 适用于支票、发票、合同等正式财务文件</li>
            <li>• 转换结果可直接复制使用</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
