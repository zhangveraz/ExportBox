// 名称: 阶梯佣金计算器
// 描述: 按累计销售额分段计提佣金，支持回款率折算与达标奖金
// 路径: ExportBox/app/tools/commission-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

'use client'

import { useMemo, useState } from 'react'
import { Percent, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { ToolShell } from '@/components/tools/tool-shell'
import { createId } from '@/lib/utils'
import { EnhancedAlert } from '@/components/ui/enhanced-alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { FormattedInput } from '@/components/ui/formatted-input'
import { Label } from '@/components/ui/label'
import { buildCommissionSummary, calculateCommission } from '@/lib/tools/commission-calculator'

interface TierFormState {
  id: string
  upToAmount: string
  ratePercent: string
}

interface CommissionFormState {
  salesAmount: string
  collectionPercent: string
  targetBonus: string
  bonusThresholdAmount: string
  tiers: TierFormState[]
}

function createInitialForm(): CommissionFormState {
  return {
    salesAmount: '1200000',
    collectionPercent: '90',
    targetBonus: '20000',
    bonusThresholdAmount: '1000000',
    tiers: [
      { id: 'tier-1', upToAmount: '500000', ratePercent: '2' },
      { id: 'tier-2', upToAmount: '1000000', ratePercent: '3' },
      { id: 'tier-3', upToAmount: '0', ratePercent: '4' },
    ],
  }
}

function toNumber(value: string): number {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export default function CommissionCalculatorPage() {
  const [form, setForm] = useState<CommissionFormState>(createInitialForm)

  const calculation = useMemo(() => {
    try {
      const result = calculateCommission({
        salesAmount: toNumber(form.salesAmount),
        collectionPercent: toNumber(form.collectionPercent),
        targetBonus: toNumber(form.targetBonus),
        bonusThresholdAmount: toNumber(form.bonusThresholdAmount),
        tiers: form.tiers.map((tier) => ({
          id: tier.id,
          upToAmount: toNumber(tier.upToAmount),
          ratePercent: toNumber(tier.ratePercent),
        })),
      })
      return { result, error: '' }
    } catch (error) {
      return { result: null, error: error instanceof Error ? error.message : '佣金无法计算，请检查档位配置' }
    }
  }, [form])

  const updateTier = (tierId: string, field: 'upToAmount' | 'ratePercent', value: string) => setForm((current) => ({
    ...current,
    tiers: current.tiers.map((tier) => (tier.id === tierId ? { ...tier, [field]: value } : tier)),
  }))
  const addTier = () => setForm((current) => {
    if (current.tiers.length >= 5) return current
    const lastNonZero = [...current.tiers].reverse().find((tier) => tier.upToAmount !== '0')
    return { ...current, tiers: [...current.tiers, { id: createId('tier'), upToAmount: '0', ratePercent: lastNonZero ? String(toNumber(lastNonZero.ratePercent) + 1) : '2' }] }
  })
  const removeTier = (tierId: string) => setForm((current) => {
    if (current.tiers.length <= 2) return current
    return { ...current, tiers: current.tiers.filter((tier) => tier.id !== tierId) }
  })

  return (
    <ToolShell title="阶梯佣金计算器" description="按累计销售额分段计提佣金（超额累进），支持回款率折算与达标奖金，输出分段明细与实际到手。">

      {calculation.error && <EnhancedAlert type="error" title="计算错误" message={calculation.error} action={{ label: '重置', onClick: () => setForm(createInitialForm()) }} className="mb-2.5" />}

      <div className="grid gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card className="gap-0 py-0">
          <CardHeader className="px-3 pt-3 pb-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><Percent className="h-4 w-4" />业绩与档位</CardTitle>
                <p className="text-[10px] text-muted-foreground">末档上限填 0 表示不封顶；中间档上限必须逐级递增</p>
              </div>
              <Button type="button" variant="outline" size="sm" className="h-7 shrink-0 px-2 text-[11px]" onClick={() => setForm(createInitialForm())}>
                <RefreshCw className="mr-1 h-3 w-3" />重置
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
            <div className="grid grid-cols-2 gap-x-2.5 gap-y-2">
              <NumberField id="salesAmount" label="累计销售额" suffix="CNY" value={form.salesAmount} onChange={(value) => setForm((current) => ({ ...current, salesAmount: value }))} />
              <NumberField id="collectionPercent" label="回款率" suffix="%" value={form.collectionPercent} onChange={(value) => setForm((current) => ({ ...current, collectionPercent: value }))} />
              <NumberField id="targetBonus" label="达标奖金（可选）" suffix="CNY" value={form.targetBonus} onChange={(value) => setForm((current) => ({ ...current, targetBonus: value }))} />
              <NumberField id="bonusThresholdAmount" label="奖金起征销售额" suffix="CNY" value={form.bonusThresholdAmount} onChange={(value) => setForm((current) => ({ ...current, bonusThresholdAmount: value }))} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-[13px] font-semibold">佣金档位（2–5 档）</h3>
                  <p className="text-[10px] text-muted-foreground">超额累进：每段销售额按本段费率单独计提</p>
                </div>
                <Button type="button" variant="outline" size="sm" className="h-7 shrink-0 px-2 text-[11px]" onClick={addTier} disabled={form.tiers.length >= 5}>
                  <Plus className="mr-1 h-3 w-3" />添加档位
                </Button>
              </div>
              {form.tiers.map((tier, index) => {
                const isLast = index === form.tiers.length - 1
                return (
                  <div key={tier.id} className="grid items-end gap-2 rounded-md border bg-muted/20 px-2 py-1.5 sm:grid-cols-[minmax(0,1fr)_110px_32px]">
                    <NumberField
                      id={`${tier.id}-upTo`}
                      label={isLast ? '本档上限（0 = 不封顶）' : `第 ${index + 1} 档销售额上限`}
                      suffix="CNY"
                      value={tier.upToAmount}
                      onChange={(value) => updateTier(tier.id, 'upToAmount', value)}
                    />
                    <NumberField id={`${tier.id}-rate`} label="佣金费率" suffix="%" value={tier.ratePercent} onChange={(value) => updateTier(tier.id, 'ratePercent', value)} />
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="删除档位" aria-label={`删除第 ${index + 1} 档`} disabled={form.tiers.length <= 2} onClick={() => removeTier(tier.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2.5">
          {calculation.result ? (
            <Card className="gap-0 py-0">
              <CardHeader className="gap-1 px-3 pt-2.5 pb-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm font-semibold">佣金核算</CardTitle>
                    <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground" title={`销售额 ${calculation.result.salesAmount.toLocaleString('en-US')} CNY · 回款率 ${calculation.result.collectionPercent}%`}>
                      销售额 {calculation.result.salesAmount.toLocaleString('en-US')} CNY · 回款率 {calculation.result.collectionPercent}%
                    </p>
                  </div>
                  <EnhancedCopyButton text={buildCommissionSummary(calculation.result)} variant="outline" size="sm" className="mt-0.5 h-6 shrink-0 px-2 text-[11px]">复制</EnhancedCopyButton>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 px-3 pt-0 pb-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <Stat label="佣金合计" value={`${calculation.result.totalCommission.toLocaleString('en-US')} CNY`} note={`有效费率 ${calculation.result.effectiveRatePercent}%`} highlight />
                  <Stat label="回款后实得" value={`${calculation.result.collectedCommission.toLocaleString('en-US')} CNY`} note={`未回款挂账 ${calculation.result.uncollectedCommission.toLocaleString('en-US')}`} />
                </div>
                <div className="divide-y divide-border/70 rounded-md border bg-muted/20">
                  {calculation.result.tiers.map((tier) => (
                    <div key={tier.id} className="flex items-center justify-between gap-2 px-2 py-1 text-[12px]">
                      <span className="min-w-0 truncate text-muted-foreground">{tier.rangeLabel}</span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <Badge variant="outline" className="border-slate-200 px-1 py-0 text-[10px] text-slate-500 dark:border-white/10 dark:text-slate-300">{tier.ratePercent}%</Badge>
                        <span className="font-semibold tabular-nums">{tier.commission.toLocaleString('en-US')}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-2 border-t pt-1.5 text-[12px] font-semibold">
                  <span>{calculation.result.bonusUnlocked ? `含达标奖金 ${toNumber(form.targetBonus).toLocaleString('en-US')} CNY` : '未达奖金起征线'}</span>
                  <span className="tabular-nums text-emerald-700 dark:text-cyan-200">合计发放 {calculation.result.totalPayout.toLocaleString('en-US')} CNY</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border border-dashed p-4 text-center text-[12px] text-muted-foreground">修正档位配置后查看佣金核算</div>
          )}
        </div>
      </div>
    </ToolShell>
  )
}

function Stat({ label, value, note, highlight = false }: { label: string; value: string; note?: string; highlight?: boolean }) {
  return (
    <div className="rounded-md border bg-muted/20 px-2.5 py-1.5">
      <p className="text-[10px] leading-3 text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-[13px] leading-5 font-bold tabular-nums ${highlight ? 'text-emerald-700 dark:text-cyan-200' : ''}`}>{value}</p>
      {note && <p className="truncate text-[10px] text-muted-foreground">{note}</p>}
    </div>
  )
}

function NumberField({ id, label, suffix, value, onChange }: { id: string; label: string; suffix: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">{label}</Label>
      <div className="relative">
        <FormattedInput id={id} value={value} onChange={onChange} format="decimal" maxDecimals={2} className="h-8 pr-14 text-[13px] font-medium" />
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">{suffix}</span>
      </div>
    </div>
  )
}
