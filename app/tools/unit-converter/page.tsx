// 名称: 外贸单位换算器（紧凑版）
// 描述: 单屏布局下的参数区与结果区：量纲切换、数值输入与同量纲速览
// 路径: ExportBox/app/tools/unit-converter/page.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

'use client'

import { useMemo, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { FormattedInput } from '@/components/ui/formatted-input'
import { TOOL_RESULT_COLUMN, ToolShell } from '@/components/tools/tool-shell'
import { cn } from '@/lib/utils'
import {
  DEFAULT_UNIT_SELECTIONS,
  UNIT_CATEGORY_LABELS,
  UNIT_GROUPS,
  convertUnit,
  formatUnitInput,
  formatUnitValue,
  type UnitCategory,
} from '@/lib/tools/unit-converter'

const CATEGORIES = Object.keys(UNIT_CATEGORY_LABELS) as UnitCategory[]

const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

export default function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [sourceUnit, setSourceUnit] = useState(DEFAULT_UNIT_SELECTIONS.length.source)
  const [targetUnit, setTargetUnit] = useState(DEFAULT_UNIT_SELECTIONS.length.target)
  const [inputValue, setInputValue] = useState(DEFAULT_UNIT_SELECTIONS.length.value)
  const units = UNIT_GROUPS[category]
  const numericValue = inputValue.trim() === '' ? Number.NaN : Number(inputValue)
  const result = useMemo(
    () => convertUnit(category, numericValue, sourceUnit, targetUnit),
    [category, numericValue, sourceUnit, targetUnit]
  )
  const source = units.find((unit) => unit.id === sourceUnit)
  const target = units.find((unit) => unit.id === targetUnit)

  const selectCategory = (nextCategory: UnitCategory) => {
    const defaults = DEFAULT_UNIT_SELECTIONS[nextCategory]
    setCategory(nextCategory)
    setSourceUnit(defaults.source)
    setTargetUnit(defaults.target)
    setInputValue(defaults.value)
  }

  const reset = () => selectCategory(category)
  const swapUnits = () => {
    setSourceUnit(targetUnit)
    setTargetUnit(sourceUnit)
    if (result !== null) setInputValue(formatUnitInput(result))
  }
  const copyText = result === null || !source || !target
    ? ''
    : `${formatUnitValue(numericValue)} ${source.symbol} = ${formatUnitValue(result)} ${target.symbol}`

  return (
    <ToolShell
      title="外贸单位换算器"
      description="快速换算物流、包装与产品规格中的公制和英制长度、重量、体积单位"
      onReset={reset}
    >
      {/* 参数只有三样，右侧速览表才是主角，右列给到 6 成 */}
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)]">
        {/* 左：参数 */}
        <div className={panelClass}>
          {/* 量纲切换 */}
          <div className="grid grid-cols-4 gap-1.5 rounded-lg bg-slate-50 p-1 dark:bg-white/5">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => selectCategory(item)}
                className={cn(
                  'h-7 rounded-md text-[11px] font-medium transition-colors',
                  category === item
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-white hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-900'
                )}
              >
                {UNIT_CATEGORY_LABELS[item]}
              </button>
            ))}
          </div>

          <label htmlFor="unit-value" className="mt-3 block">
            <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">数值</span>
            <FormattedInput
              id="unit-value"
              value={inputValue}
              onChange={setInputValue}
              format="decimal"
              autoFocusFirst
              placeholder="请输入数字"
              className="h-10 text-lg font-semibold tabular-nums"
            />
          </label>

          <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <label htmlFor="source-unit" className="block min-w-0">
              <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">原单位</span>
              <Select value={sourceUnit} onValueChange={setSourceUnit}>
                <SelectTrigger id="source-unit" className="h-8 px-2 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.label}（{unit.symbol}）
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <button
              type="button"
              aria-label="交换原单位和目标单位"
              onClick={swapUnits}
              className="mb-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-white/15 dark:text-slate-300"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
            </button>
            <label htmlFor="target-unit" className="block min-w-0">
              <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">目标单位</span>
              <Select value={targetUnit} onValueChange={setTargetUnit}>
                <SelectTrigger id="target-unit" className="h-8 px-2 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.label}（{unit.symbol}）
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          {result === null && (
            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] text-red-600 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300">
              请输入大于或等于 0 的有效数字。
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-white/10">
            <p className="min-w-0 truncate text-[11px] text-slate-400 dark:text-slate-500">
              {source && target ? `${source.label} → ${target.label}` : '请选择单位'}
            </p>
            <EnhancedCopyButton text={copyText} disabled={result === null} variant="outline" size="sm" className="h-7 px-2.5 text-xs">
              复制结果
            </EnhancedCopyButton>
          </div>
        </div>

        {/* 右：结果 + 同量纲速览 */}
        <div className={TOOL_RESULT_COLUMN}>
          <div className={panelClass}>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">换算结果</h2>
            <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 dark:border-cyan-300/20 dark:bg-cyan-300/10">
              <p className="wrap-break-word text-[22px] font-bold tabular-nums text-emerald-950 dark:text-white">
                {result === null || !target ? '—' : `${formatUnitValue(result)} ${target.symbol}`}
              </p>
              {result !== null && source && target && (
                <p className="mt-0.5 text-[11px] text-emerald-700 dark:text-cyan-200">
                  {formatUnitValue(numericValue)} {source.symbol} = {formatUnitValue(result)} {target.symbol}
                </p>
              )}
            </div>
          </div>

          <div className={panelClass}>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">同量纲速览</h2>
            <div className="mt-2 grid grid-cols-2 gap-1.5 2xl:grid-cols-3">
              {units
                .filter((unit) => unit.id !== sourceUnit)
                .map((unit) => {
                  const converted = convertUnit(category, numericValue, sourceUnit, unit.id)
                  return (
                    <div key={unit.id} className="flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-slate-50/60 px-2 py-1 text-[11px] dark:border-white/10 dark:bg-white/5">
                      <span className="min-w-0 truncate text-slate-500 dark:text-slate-400" title={unit.label}>
                        {unit.label}
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums text-slate-900 dark:text-white">
                        {converted === null ? '—' : formatUnitValue(converted)}
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  )
}
