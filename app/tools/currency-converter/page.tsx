// 名称: 多币种换算器（紧凑版）
// 描述: 单屏布局下的参数区与结果区：交叉换算结果 + 全币种换算表
// 路径: ExportBox/app/tools/currency-converter/page.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeftRight, RefreshCw } from 'lucide-react'
import { TOOL_RESULT_COLUMN, ToolShell } from '@/components/tools/tool-shell'
import { EnhancedAlert } from '@/components/ui/enhanced-alert'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { FormattedInput } from '@/components/ui/formatted-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  FALLBACK_EXCHANGE_RATES,
  fetchExchangeRates,
  getExchangeRateSourceLabel,
  type ExchangeRateSnapshot,
} from '@/lib/tools/exchange-rate'
import {
  CONVERTER_CURRENCIES,
  buildConversionSummary,
  buildConversionTable,
  convertCurrency,
} from '@/lib/tools/currency-converter'

const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

function CurrencySelect({ id, value, onChange }: { id: string; value: string; onChange: (code: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="h-8 px-2 text-[13px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CONVERTER_CURRENCIES.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.code} · {currency.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState('10000')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('CNY')
  const [markupPercent, setMarkupPercent] = useState('0')
  const [manualUsdRate, setManualUsdRate] = useState('')
  const [rateSnapshot, setRateSnapshot] = useState<ExchangeRateSnapshot>({
    rates: { ...FALLBACK_EXCHANGE_RATES },
    source: 'fallback',
    fetchedAt: null,
    stale: true,
  })

  useEffect(() => {
    let cancelled = false
    fetchExchangeRates().then((snapshot) => {
      if (!cancelled) setRateSnapshot(snapshot)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // 手动锁定 1 USD = ? CNY：按比例整体缩放全表，保持所有交叉汇率口径一致
  const rates = useMemo(() => {
    const usdToCny = Number.parseFloat(manualUsdRate)
    const liveUsdRate = rateSnapshot.rates.USD
    if (Number.isFinite(usdToCny) && usdToCny > 0 && Number.isFinite(liveUsdRate) && liveUsdRate > 0) {
      const scale = 1 / usdToCny / liveUsdRate
      const scaled = Object.fromEntries(Object.entries(rateSnapshot.rates).map(([code, rate]) => [code, rate * scale]))
      return { ...scaled, CNY: 1 }
    }
    return rateSnapshot.rates
  }, [rateSnapshot, manualUsdRate])

  const calculation = useMemo(() => {
    try {
      const markup = Number.parseFloat(markupPercent) || 0
      const result = convertCurrency({ amount: Number.parseFloat(amount) || 0, from, to, rates, markupPercent: markup })
      return { result, table: buildConversionTable(Number.parseFloat(amount) || 0, from, rates, markup), error: '' }
    } catch (error) {
      return { result: null, table: [], error: error instanceof Error ? error.message : '换算失败，请检查输入' }
    }
  }, [amount, from, to, rates, markupPercent])

  const sourceLabel = getExchangeRateSourceLabel(rateSnapshot)
  const reset = () => {
    setAmount('10000')
    setFrom('USD')
    setTo('CNY')
    setMarkupPercent('0')
    setManualUsdRate('')
  }

  return (
    <ToolShell
      title="多币种报价换算器"
      description="按实时汇率做常用贸易币种交叉换算，支持点差模拟与全币种换算表，汇率获取失败时降级为内置参考汇率"
      onReset={reset}
    >
      {/* 左侧只有金额和币种，右侧要放下全币种换算表，右列加宽 */}
      <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]">
        {/* 左：换算参数 */}
        <div className={panelClass}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="min-w-0 truncate text-[11px] text-slate-500 dark:text-slate-400" title={sourceLabel}>
              汇率来源：{sourceLabel}
            </p>
            <button
              type="button"
              onClick={() => setManualUsdRate('')}
              className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 px-2 text-[11px] text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-white/15 dark:text-slate-300"
            >
              <RefreshCw className="h-3 w-3" />
              恢复实时
            </button>
          </div>

          <label htmlFor="amount" className="mt-3 block">
            <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">金额</span>
            <FormattedInput
              id="amount"
              value={amount}
              onChange={setAmount}
              format="decimal"
              maxDecimals={2}
              className="h-9 font-semibold tabular-nums"
            />
          </label>

          {/* 币种：从 → 到，一键互换 */}
          <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <label htmlFor="from" className="block min-w-0">
              <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">从</span>
              <CurrencySelect id="from" value={from} onChange={setFrom} />
            </label>
            <button
              type="button"
              aria-label="交换币种"
              onClick={() => {
                setFrom(to)
                setTo(from)
              }}
              className="mb-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-white/15 dark:text-slate-300"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
            </button>
            <label htmlFor="to" className="block min-w-0">
              <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">到</span>
              <CurrencySelect id="to" value={to} onChange={setTo} />
            </label>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-white/10">
            <label htmlFor="markup" className="block min-w-0">
              <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">渠道点差 %（可选）</span>
              <FormattedInput id="markup" value={markupPercent} onChange={setMarkupPercent} format="decimal" maxDecimals={2} className="h-8 text-[13px] font-medium" />
            </label>
            <label htmlFor="manualUsd" className="block min-w-0">
              <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">手动锁定 1 USD = ? CNY</span>
              <input
                id="manualUsd"
                value={manualUsdRate}
                onChange={(event) => setManualUsdRate(event.target.value)}
                placeholder="留空用实时汇率"
                inputMode="decimal"
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[13px] font-medium tabular-nums text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-white/15 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400/60 dark:focus:ring-blue-400/20"
              />
            </label>
          </div>

          {calculation.error && <EnhancedAlert type="error" title="换算失败" message={calculation.error} />}
        </div>

        {/* 右：结果 + 全币种表 */}
        <div className={TOOL_RESULT_COLUMN}>
          {calculation.result && (
            <div className={panelClass}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">换算结果</h2>
                  <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">{calculation.result.rateUnit}</p>
                </div>
                <EnhancedCopyButton text={buildConversionSummary(calculation.result)} variant="outline" size="sm" className="h-7 px-2.5 text-xs">
                  复制
                </EnhancedCopyButton>
              </div>

              <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 dark:border-cyan-300/20 dark:bg-cyan-300/10">
                <p className="text-[22px] font-bold tabular-nums text-emerald-900 dark:text-white">
                  {calculation.result.convertedAmount.toLocaleString('en-US', {
                    minimumFractionDigits: calculation.result.to === 'JPY' || calculation.result.to === 'KRW' ? 0 : 2,
                  })}
                  <span className="ml-1.5 text-xs font-semibold text-emerald-800 dark:text-cyan-100">{calculation.result.to}</span>
                </p>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <Stat label="中间价" value={String(calculation.result.midRate)} />
                <Stat
                  label="适用汇率"
                  value={String(calculation.result.appliedRate)}
                  note={calculation.result.markupPercent > 0 ? `含 ${calculation.result.markupPercent}% 点差` : '未加点差'}
                />
              </div>
            </div>
          )}

          {calculation.table.length > 0 && (
            <div className={panelClass}>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">全币种换算表</h2>
                <span className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                  {Number.parseFloat(amount).toLocaleString('en-US')} {from} 按中间价折算
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1 2xl:grid-cols-4">
                {calculation.table.map((row) => (
                  <div key={row.code} className="flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-slate-50/60 px-2 py-1 dark:border-white/10 dark:bg-white/5">
                    <span className="min-w-0 truncate text-[11px] font-medium text-slate-600 dark:text-slate-300" title={`${row.code} · ${row.name}`}>
                      {row.code}
                    </span>
                    <span className="shrink-0 text-[11px] font-semibold tabular-nums text-slate-900 dark:text-white">
                      {row.converted.toLocaleString('en-US', { minimumFractionDigits: row.code === 'JPY' || row.code === 'KRW' ? 0 : 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  )
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-2.5 py-1.5 dark:bg-white/5">
      <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-[13px] font-semibold tabular-nums text-slate-900 dark:text-white">{value}</p>
      {note && <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">{note}</p>}
    </div>
  )
}
