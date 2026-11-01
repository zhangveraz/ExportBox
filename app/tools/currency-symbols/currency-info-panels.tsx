// 名称: 货币信息面板
// 描述: 展示货币统计与参考说明（紧凑版）
// 路径: ExportBox/app/tools/currency-symbols/currency-info-panels.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { CircleDollarSign, Info, Star, TrendingUp } from 'lucide-react'

interface CurrencyStatsProps {
  totalCount: number
  popularCount: number
  tradingCount: number
  favoriteCount: number
}

export function CurrencyStats(props: CurrencyStatsProps) {
  const stats = [
    { label: '货币总数', value: props.totalCount, note: '种', icon: CircleDollarSign },
    { label: '主要货币', value: props.popularCount, note: '种', icon: TrendingUp },
    { label: '贸易货币', value: props.tradingCount, note: '种', icon: Star },
    { label: '已收藏', value: props.favoriteCount, note: '种', icon: Star },
  ]

  return (
    <div className="mb-2.5 grid grid-cols-4 gap-2">
      {stats.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5">
            <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate text-[10px] leading-3 text-muted-foreground">{item.label}</p>
              <p className="text-[13px] leading-5 font-semibold">{item.value}<span className="ml-1 text-[10px] font-normal text-muted-foreground">{item.note}</span></p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const CURRENCY_EXAMPLES = [
  ['USD ($)', '$1,234.56'],
  ['EUR (€)', '€1.234,56'],
  ['CNY (¥)', '¥1,234.56'],
  ['GBP (£)', '£1,234.56'],
]

export function CurrencyReference() {
  return (
    <details className="group mt-2.5 rounded-lg border bg-muted/40 px-3 py-2">
      <summary className="flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-slate-700 dark:text-slate-200">
        <Info className="h-3.5 w-3.5" />常用货币写法与使用说明
        <span className="ml-auto text-[11px] font-normal text-muted-foreground group-open:hidden">展开</span>
      </summary>
      <div className="mt-2 grid gap-2.5 md:grid-cols-2">
        <div className="rounded-md border bg-background p-2">
          <p className="mb-1 text-[11px] font-semibold">货币书写示例</p>
          <div className="space-y-0.5">
            {CURRENCY_EXAMPLES.map(([code, example]) => (
              <div key={code} className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-mono">{code}</span>
                <span className="text-muted-foreground">→</span>
                <span className="flex-1 text-right">{example}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-0.5 rounded-md border bg-background p-2 text-[11px] leading-4 text-muted-foreground">
          <p>• 点击“复制符号”可快速复制货币符号到剪贴板</p>
          <p>• 点击“复制代码”可复制 ISO 4217 标准货币代码</p>
          <p>• 蓝色“常用”标签表示国际贸易中的主要结算货币</p>
          <p>• 绿色“贸易”标签表示重要的国际贸易货币</p>
          <p>• 收藏常用货币方便快速查找和使用</p>
          <p>• 合同中建议同时标注符号和代码，如：$100 USD</p>
        </div>
      </div>
    </details>
  )
}
