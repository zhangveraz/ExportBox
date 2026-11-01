// 名称: 降价保利销量计算器
// 描述: 评估客户压价后的利润损失与保利增量
// 路径: ExportBox/app/tools/discount-volume-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01
'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools/tool-shell'
import { CopyButton } from '@/components/tools/copy-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateDiscountVolume, type DiscountVolumeInput } from '@/lib/tools/discount-volume-calculator'

const initial = { price: '100', unitCost: '70', quantity: '1000', discountPercent: '5', feePercent: '2', fixedCost: '5000' }
const fields: { key: keyof DiscountVolumeInput; label: string; hint: string }[] = [
  { key: 'price', label: '原销售单价', hint: '所有金额使用同一币种' },
  { key: 'unitCost', label: '单位变动成本', hint: '采购、包装及随数量增加的费用' },
  { key: 'quantity', label: '原订单数量', hint: '按整数件计算' },
  { key: 'discountPercent', label: '降价幅度（%）', hint: '5 表示降价 5%，不是打五折' },
  { key: 'feePercent', label: '成交费率（%）', hint: '佣金、收款费等按销售额计提的总费率' },
  { key: 'fixedCost', label: '订单固定成本', hint: '不随销量变化的费用' },
]
const money = (value: number) => value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function DiscountVolumePage() {
  const [form, setForm] = useState(initial)
  let result: ReturnType<typeof calculateDiscountVolume> | null = null
  let error = ''
  try {
    if (Object.values(form).some((value) => !value.trim())) throw new Error('请完整填写所有参数')
    result = calculateDiscountVolume(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, Number(value)])) as unknown as DiscountVolumeInput)
  } catch (reason) { error = reason instanceof Error ? reason.message : '请检查输入' }
  const summary = result ? `降价保利测算（金额均为同一币种）\n降价 ${form.discountPercent}%，新单价 ${money(result.discountedPrice)}\n原订单利润 ${money(result.originalProfit)}；同数量降价后利润 ${money(result.sameQuantityProfit)}\n${result.requiredQuantity === null ? '新单价无法覆盖单位变动成本，无法靠增加销量保利' : `维持原利润需 ${result.requiredQuantity} 件，增加 ${result.extraQuantity} 件（${result.growthPercent!.toFixed(2)}%）`}\n假设：单位成本、费率和固定成本不变。` : ''
  return <ToolShell title="降价保利销量计算器" description="客户要求降价时，快速计算需要增加多少销量才能维持原订单利润。">

    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)]">
      <Card className="gap-0 py-0"><CardHeader className="px-3 pt-3 pb-1.5"><CardTitle className="text-sm font-semibold">报价与成本</CardTitle></CardHeader><CardContent className="px-3 pt-0 pb-3">
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-2">
          {fields.map(({ key, label, hint }) => <div key={key} className="space-y-1">
            <Label htmlFor={key} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">{label}</Label>
            <Input id={key} type="number" min="0" step={key === 'quantity' ? '1' : 'any'} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} aria-describedby={`${key}-hint`} className="h-8 text-[13px]" />
            <p id={`${key}-hint`} className="line-clamp-1 text-[10px] leading-3.5 text-muted-foreground" title={hint}>{hint}</p>
          </div>)}
        </div>
        <Button variant="outline" size="sm" className="mt-2.5 h-7 text-xs" onClick={() => setForm(initial)}>重置示例</Button>
      </CardContent></Card>
      <Card className="gap-0 py-0"><CardHeader className="px-3 pt-3 pb-1.5"><CardTitle className="text-sm font-semibold">保利测算结果</CardTitle></CardHeader><CardContent className="px-3 pt-0 pb-3" aria-live="polite">
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {result && <>
          <dl className="divide-y divide-border/70">{[
            ['降价后单价', money(result.discountedPrice)], ['原订单利润', money(result.originalProfit)],
            ['同数量降价后利润', money(result.sameQuantityProfit)], ['同数量利润减少', money(result.profitLoss)],
            ['保利所需总销量', result.requiredQuantity === null ? '无法通过增量保利' : `${result.requiredQuantity.toLocaleString('zh-CN')} 件`],
            ['需增加销量', result.extraQuantity === null ? '—' : `${result.extraQuantity.toLocaleString('zh-CN')} 件（${result.growthPercent!.toFixed(2)}%）`],
          ].map(([label, value]) => <div key={label} className="flex flex-wrap items-baseline justify-between gap-2 py-1.5"><dt className="text-[12px] text-muted-foreground">{label}</dt><dd className="text-[13px] font-semibold tabular-nums">{value}</dd></div>)}</dl>
          {result.requiredQuantity === null && <p className="mt-1.5 text-xs text-destructive">降价后单件贡献利润不大于 0，增加销量无法维持原利润。</p>}
          {result.originalProfit < 0 && <p className="mt-1.5 text-xs text-amber-600">原订单已经亏损；“保利”仅表示维持原亏损水平，不代表实现盈利。</p>}
          <div className="mt-2"><CopyButton text={summary} /></div>
        </>}
        <details className="mt-2 rounded-md bg-muted/70 px-2.5 py-1.5 text-[11px] leading-5 text-muted-foreground">
          <summary className="cursor-pointer text-[11px] font-medium text-slate-600 dark:text-slate-300">计算口径与假设</summary>
          <div className="mt-1 space-y-0.5"><p>单件贡献利润 = 单价 ×（1 − 成交费率）− 单位变动成本。</p><p>保利销量 = 原销量 × 原单件贡献利润 ÷ 降价后单件贡献利润，向上取整。</p><p>假设单位成本、成交费率及订单固定成本不变；未考虑新增产能、阶梯运费、税费或汇率变动。金额统一使用输入币种，单价按完整精度测算，显示保留两位小数。</p></div>
        </details>
      </CardContent></Card>
    </div>
  </ToolShell>
}
