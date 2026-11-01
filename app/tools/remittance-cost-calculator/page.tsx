// 名称: 国际收款渠道费用对比工具页面
// 描述: 按订单金额、汇率与资金成本比较电汇、信用证、托收与第三方渠道的到手金额与总成本（单屏紧凑版）
// 路径: ExportBox/app/tools/remittance-cost-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

'use client'

import { useMemo, useState } from 'react'
import { BadgeCheck, CircleDollarSign, Clock3, Landmark, RotateCcw, TrendingDown } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EnhancedAlert } from '@/components/ui/enhanced-alert'
import { FormattedInput } from '@/components/ui/formatted-input'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { MobileButtonGroup } from '@/components/tools/mobile-friendly-wrapper'
import { ScenarioPresets } from '@/components/tools/scenario-presets'
import { ToolShell } from '@/components/tools/tool-shell'
import { REMITTANCE_CHANNELS, calculateRemittance, type RemittanceChannelId } from '@/lib/tools/remittance-cost-calculator'
import {
  DEFAULT_REMITTANCE_FORM,
  REMITTANCE_CURRENCIES,
  REMITTANCE_PRESETS,
  REMITTANCE_SETTLEMENT_CURRENCIES,
  buildRemittanceSummary,
  formatDays,
  formatMoney,
  formatPercent,
  toNumber,
  type RemittanceFormState,
} from './remittance-page-data'

const LABEL = 'text-[11px] leading-4'

function AmountField({ id, label, suffix, value, onChange, integer = false }: { id: string; label: string; suffix: string; value: string; onChange: (value: string) => void; integer?: boolean }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className={LABEL}>{label}</Label>
      <div className="relative">
        <FormattedInput id={id} value={value} onChange={onChange} format={integer ? 'number' : 'decimal'} maxDecimals={integer ? 0 : 4} className="h-8 pr-16 text-[12px] font-medium" />
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">{suffix}</span>
      </div>
    </div>
  )
}

export default function RemittanceCostCalculatorPage() {
  const [form, setForm] = useState<RemittanceFormState>(DEFAULT_REMITTANCE_FORM)

  const update = <Key extends keyof RemittanceFormState>(key: Key, value: RemittanceFormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const toggleChannel = (id: RemittanceChannelId) => {
    setForm((current) => ({
      ...current,
      channelIds: current.channelIds.includes(id)
        ? current.channelIds.filter((item) => item !== id)
        : [...current.channelIds, id],
    }))
  }

  const calculation = useMemo(() => {
    try {
      return {
        result: calculateRemittance({
          orderAmount: toNumber(form.orderAmount),
          currency: form.currency,
          exchangeRate: toNumber(form.exchangeRate),
          settlementCurrency: form.settlementCurrency,
          annualFundingRatePercent: toNumber(form.annualFundingRatePercent),
          sellerPaysFee: form.sellerPaysFee,
          channelIds: form.channelIds,
        }),
        error: '',
      }
    } catch (error) {
      return { result: null, error: error instanceof Error ? error.message : '收款渠道无法计算，请检查输入' }
    }
  }, [form])

  const summaryText = useMemo(() => (calculation.result ? buildRemittanceSummary(calculation.result) : ''), [calculation.result])
  const best = calculation.result?.channels.find((channel) => channel.id === calculation.result?.bestChannelId)
  const fastest = calculation.result?.channels.find((channel) => channel.id === calculation.result?.fastestChannelId)

  return (
    <ToolShell title="国际收款渠道费用对比" description="按订单金额、结算币种与汇率折算，比较电汇、信用证、托收与第三方渠道的手续费、汇损、资金占用与到手金额。">
      <ScenarioPresets presets={REMITTANCE_PRESETS} onSelect={(values) => setForm((current) => ({ ...current, ...values }))} />

      {calculation.error && (
        <EnhancedAlert type="error" title="计算错误" message={calculation.error} action={{ label: '重置', onClick: () => setForm(DEFAULT_REMITTANCE_FORM) }} className="mt-2.5" />
      )}

      <div className="mt-2.5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <Card className="self-start">
          <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><Landmark className="h-3.5 w-3.5" />订单与结算口径</CardTitle>
            <span className="shrink-0 text-[10px] text-muted-foreground">已选 {form.channelIds.length} 个渠道</span>
          </CardHeader>
          <CardContent className="space-y-2 px-3 pt-0 pb-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <AmountField id="orderAmount" label="订单金额" suffix={form.currency} value={form.orderAmount} onChange={(value) => update('orderAmount', value)} />
              <div className="space-y-1">
                <Label htmlFor="currency" className={LABEL}>支付币种</Label>
                <Select value={form.currency} onValueChange={(value) => update('currency', value)}>
                  <SelectTrigger id="currency" className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{REMITTANCE_CURRENCIES.map((code) => <SelectItem key={code} value={code}>{code}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <AmountField id="exchangeRate" label="折算汇率" suffix={`1 ${form.currency} =`} value={form.exchangeRate} onChange={(value) => update('exchangeRate', value)} />
              <div className="space-y-1">
                <Label htmlFor="settlementCurrency" className={LABEL}>结算币种</Label>
                <Select value={form.settlementCurrency} onValueChange={(value) => update('settlementCurrency', value)}>
                  <SelectTrigger id="settlementCurrency" className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{REMITTANCE_SETTLEMENT_CURRENCIES.map((code) => <SelectItem key={code} value={code}>{code}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <AmountField id="annualFundingRate" label="资金年化成本" suffix="%" value={form.annualFundingRatePercent} onChange={(value) => update('annualFundingRatePercent', value)} />
              <div className="space-y-1">
                <Label htmlFor="feeBearer" className={LABEL}>渠道费用承担方</Label>
                <Button id="feeBearer" type="button" variant={form.sellerPaysFee ? 'default' : 'outline'} aria-pressed={form.sellerPaysFee} onClick={() => update('sellerPaysFee', !form.sellerPaysFee)} className="h-8 w-full text-[11px]">
                  {form.sellerPaysFee ? '卖方承担（从收款扣除）' : '买方承担（全额到手）'}
                </Button>
              </div>
            </div>

            <div className="space-y-1 rounded-md border px-2 py-1.5">
              <p className="text-[11px] font-medium leading-4">参与对比的渠道<span className="ml-1 font-normal text-muted-foreground">（至少两个，费率可谈判后调整）</span></p>
              <div className="flex flex-wrap gap-1">
                {REMITTANCE_CHANNELS.map((channel) => {
                  const selected = form.channelIds.includes(channel.id)
                  return (
                    <Button key={channel.id} type="button" variant={selected ? 'default' : 'outline'} aria-pressed={selected} title={channel.fit} onClick={() => toggleChannel(channel.id)} className="h-6 px-2 text-[11px]">
                      {channel.shortName}
                    </Button>
                  )
                })}
              </div>
              <details className="text-[10px] leading-4 text-muted-foreground">
                <summary className="cursor-pointer list-none font-medium text-foreground/80">各渠道费率口径</summary>
                <div className="mt-1 grid gap-0.5 sm:grid-cols-2">
                  {REMITTANCE_CHANNELS.map((channel) => (
                    <p key={channel.id}>{channel.shortName}：费率 {channel.ratePercent}% + 固定 {channel.fixedFee} + 中段 {channel.midFee}，汇损 {channel.fxLossPercent}%，约 {channel.collectionDays} 天</p>
                  ))}
                </div>
              </details>
            </div>

            <MobileButtonGroup>
              <EnhancedCopyButton text={summaryText} disabled={!summaryText} className="h-7 px-2 text-[11px]">复制对比摘要</EnhancedCopyButton>
              <Button type="button" variant="outline" onClick={() => setForm(DEFAULT_REMITTANCE_FORM)} className="h-7 px-2 text-[11px]">
                <RotateCcw className="mr-1 h-3 w-3" />重置
              </Button>
            </MobileButtonGroup>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {calculation.result && (
            <div className="grid grid-cols-2 gap-1.5">
              <Cell icon={BadgeCheck} label="推荐渠道" value={best ? best.name : '—'} note={best ? `${formatDays(best.collectionDays)}到账` : ''} />
              <Cell icon={CircleDollarSign} label="最低总成本" value={best ? formatMoney(best.totalCostSettlement, calculation.result.settlementCurrency) : '—'} note={best ? `成本率 ${formatPercent(best.costRatePercent)}` : ''} />
              <Cell icon={TrendingDown} label="渠道差额" value={formatMoney(calculation.result.maxSavingSettlement, calculation.result.settlementCurrency)} note="最高与最低之差" />
              <Cell icon={Clock3} label="最快到账" value={fastest ? fastest.name : '—'} note={fastest ? `${formatDays(fastest.collectionDays)} · ${formatPercent(fastest.costRatePercent)}` : ''} />
            </div>
          )}

          <Card className="self-start">
            <CardHeader className="px-3 pt-2.5 pb-1.5">
              <CardTitle className="text-sm font-semibold">渠道对比结果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 px-3 pt-0 pb-3">
              {calculation.result && calculation.result.channels.length > 0 ? (
                <>
                  {calculation.result.channels.map((channel) => {
                    const isBest = channel.id === calculation.result?.bestChannelId
                    return (
                      <div key={channel.id} className={isBest ? 'rounded-md border border-emerald-300 bg-emerald-50/70 px-2 py-1.5 dark:border-cyan-300/30 dark:bg-cyan-300/10' : 'rounded-md border px-2 py-1.5'}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-[12px] font-semibold">{channel.name}</span>
                          <Badge variant={isBest ? 'default' : 'outline'} className="h-4 shrink-0 px-1 text-[9px]">{isBest ? '推荐' : `第 ${channel.rank} 名`}</Badge>
                        </div>
                        <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] leading-4">
                          <div className="flex justify-between gap-1"><dt className="text-muted-foreground">总成本</dt><dd className="font-mono tabular-nums">{formatMoney(channel.totalCostSettlement, calculation.result!.settlementCurrency)}</dd></div>
                          <div className="flex justify-between gap-1"><dt className="text-muted-foreground">手续费</dt><dd className="font-mono tabular-nums">{formatMoney(channel.totalFeeSettlement, calculation.result!.settlementCurrency)}</dd></div>
                          <div className="flex justify-between gap-1"><dt className="text-muted-foreground">资金占用</dt><dd className="font-mono tabular-nums">{formatMoney(channel.fundingCostSettlement, calculation.result!.settlementCurrency)}</dd></div>
                          <div className="flex justify-between gap-1"><dt className="text-muted-foreground">实际到手</dt><dd className="font-mono font-semibold tabular-nums">{formatMoney(channel.netReceiptSettlement, calculation.result!.settlementCurrency)}</dd></div>
                        </dl>
                        <p className="mt-0.5 flex flex-wrap gap-x-2.5 text-[10px] leading-4 text-muted-foreground">
                          <span>成本率 {formatPercent(channel.costRatePercent)}</span>
                          <span>回款 {formatDays(channel.collectionDays)}</span>
                          <span className="truncate">{channel.settlement}</span>
                        </p>
                      </div>
                    )
                  })}
                  <details className="rounded-md bg-muted/30 px-2 py-1 text-[10px] leading-4 text-muted-foreground">
                    <summary className="cursor-pointer list-none font-medium">口径说明</summary>
                    <p className="mt-1">资金占用成本按订单金额 × 年化成本 × 回款天数 / 365 估算；汇损按订单金额百分比预算。贷方费率为常见区间参考值，实际以银行与平台当期价目为准。</p>
                  </details>
                </>
              ) : (
                <div className="rounded-md border border-dashed p-6 text-center text-[11px] text-muted-foreground">修正参数后查看渠道对比</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolShell>
  )
}

function Cell({ icon: Icon, label, value, note }: { icon: typeof BadgeCheck; label: string; value: string; note: string }) {
  return (
    <div className="rounded-md border bg-muted/40 px-2 py-1.5">
      <p className="flex items-center gap-1 truncate text-[10px] leading-4 text-muted-foreground"><Icon className="h-3 w-3 shrink-0" />{label}</p>
      <p className="truncate text-[13px] font-semibold leading-5 tabular-nums">{value}</p>
      <p className="truncate text-[10px] leading-4 text-muted-foreground">{note}</p>
    </div>
  )
}
