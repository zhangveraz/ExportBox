// 名称: 国家信息使用提示
// 描述: 折叠展示表格与详情功能说明
// 路径: ExportBox/app/tools/global-country-info/country-tips.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Info } from 'lucide-react'

const TIPS = [
  '点击「眼睛」按钮查看国家详情，含商务礼仪、贸易注意事项与节假日',
  '带「贸易大国」标签的是全球贸易额前 20 的主要贸易伙伴国',
  '跨洲国家（如俄罗斯、土耳其等）会显示「跨洲」标记',
  '点击表头可对国家名称、大洲与时差排序',
  '收藏的国家会优先显示在列表顶部，并带黄色底纹',
  '支持导出当前筛选结果为 CSV，包含全部字段',
  '时差为相对于你当前设备时区的小时差',
]

export function CountryTips() {
  return (
    <details className="rounded-lg border bg-muted/30 px-3 py-1.5 text-[11px] leading-5">
      <summary className="flex cursor-pointer list-none items-center gap-1 font-medium text-foreground/80"><Info className="h-3.5 w-3.5" />使用提示</summary>
      <div className="mt-1 grid gap-x-4 gap-y-0.5 border-t pt-1.5 text-muted-foreground md:grid-cols-2">
        {TIPS.map((tip) => <p key={tip}>· {tip}</p>)}
      </div>
    </details>
  )
}
