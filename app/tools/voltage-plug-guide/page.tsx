// 名称: 目标市场电压与插头速查
// 描述: 查询主要贸易国家的市电电压、频率与插头类型，辅助电子产品出货适配（单屏紧凑版）
// 路径: ExportBox/app/tools/voltage-plug-guide/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

'use client'

import { useMemo, useState } from 'react'
import { Info, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { ToolShell } from '@/components/tools/tool-shell'
import { PLUG_TYPE_NOTES, VOLTAGE_PLUG_ENTRIES, filterEntries } from './voltage-plug-data'

export default function VoltagePlugGuidePage() {
  const [keyword, setKeyword] = useState('')
  const entries = useMemo(() => filterEntries(VOLTAGE_PLUG_ENTRIES, keyword), [keyword])
  const usedPlugs = useMemo(() => {
    const plugs = new Set<string>()
    VOLTAGE_PLUG_ENTRIES.forEach((entry) => entry.plugs.forEach((plug) => plugs.add(plug)))
    return Array.from(plugs).sort()
  }, [])
  const voltages = useMemo(() => new Set(VOLTAGE_PLUG_ENTRIES.map((entry) => entry.voltage)).size, [])

  return (
    <ToolShell title="目标市场电压与插头速查" description="查主要贸易国家的市电电压、频率与插头类型，确认电器适配与随机插头出货方案。">
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          <Cell label="覆盖国家" value={String(VOLTAGE_PLUG_ENTRIES.length)} note="主要出口市场" />
          <Cell label="电压档位" value={String(voltages)} note="含 100–240V" />
          <Cell label="插头类型" value={String(usedPlugs.length)} note="Type A–N" />
          <Cell label="当前匹配" value={String(entries.length)} note={keyword ? `筛选「${keyword}」` : '全部结果'} />
        </div>

        <Card>
          <CardContent className="space-y-2 px-3 pt-2.5 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="按国家 / 区域 / 电压 / 插头筛选，如：日本、欧洲、110V、G"
                  className="h-8 pl-8 text-[12px]"
                  aria-label="筛选国家或插头"
                />
              </div>
              <EnhancedCopyButton
                text={entries.map((entry) => `${entry.country}：${entry.voltage} ${entry.frequency}，插头 ${entry.plugs.join('/')}`).join('\n')}
                disabled={entries.length === 0}
                className="h-7 px-2 text-[11px]"
              >
                复制筛选结果
              </EnhancedCopyButton>
            </div>

            <div className="max-h-[calc(100vh-390px)] overflow-auto rounded-md border">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr className="border-b">
                    <th className="sticky top-0 z-10 w-28 bg-muted/90 px-2 py-1.5 text-left text-[10px] font-semibold text-muted-foreground backdrop-blur">国家/地区</th>
                    <th className="sticky top-0 z-10 w-20 bg-muted/90 px-2 py-1.5 text-left text-[10px] font-semibold text-muted-foreground backdrop-blur">区域</th>
                    <th className="sticky top-0 z-10 w-16 bg-muted/90 px-2 py-1.5 text-left text-[10px] font-semibold text-muted-foreground backdrop-blur">电压</th>
                    <th className="sticky top-0 z-10 w-16 bg-muted/90 px-2 py-1.5 text-left text-[10px] font-semibold text-muted-foreground backdrop-blur">频率</th>
                    <th className="sticky top-0 z-10 bg-muted/90 px-2 py-1.5 text-left text-[10px] font-semibold text-muted-foreground backdrop-blur">插头类型</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.country} className="border-b transition-colors last:border-0 hover:bg-muted/40">
                      <td className="px-2 py-1 font-medium leading-4">{entry.country}</td>
                      <td className="px-2 py-1 text-[10px] leading-4 text-muted-foreground">{entry.region}</td>
                      <td className="px-2 py-1 font-mono leading-4 tabular-nums">{entry.voltage}</td>
                      <td className="px-2 py-1 font-mono leading-4 tabular-nums">{entry.frequency}</td>
                      <td className="px-2 py-1 leading-4">
                        <div className="flex flex-wrap gap-0.5">
                          {entry.plugs.map((plug) => (
                            <span key={plug} className="rounded border border-slate-200 bg-slate-50 px-1 font-mono text-[10px] dark:border-white/10 dark:bg-white/5">{plug}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {entries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[11px] text-muted-foreground">没有匹配「{keyword}」的国家，试试其他关键词</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <details className="rounded-lg border bg-muted/30 px-3 py-1.5 text-[11px] leading-5">
          <summary className="cursor-pointer list-none font-medium text-foreground/80">插头类型图例与出货提示</summary>
          <div className="mt-1 space-y-1.5 border-t pt-1.5">
            <div className="grid gap-x-4 gap-y-0.5 text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
              {usedPlugs.map((plug) => (
                <p key={plug} className="truncate"><span className="font-medium text-foreground">Type {plug}</span>：{PLUG_TYPE_NOTES[plug] ?? '详见 IEC 60083'}</p>
              ))}
            </div>
            <p className="flex items-start gap-1 border-t pt-1.5 text-[10px] text-muted-foreground">
              <Info className="mt-0.5 h-3 w-3 shrink-0" />
              以上为民用市电通用口径，个别国家存在区域差异或历史标准并存；正式出货前请以客户所在地实测或当地官方信息为准。
            </p>
          </div>
        </details>
      </div>
    </ToolShell>
  )
}

function Cell({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
      <p className="truncate text-[10px] leading-4 text-muted-foreground">{label}</p>
      <p className="text-[13px] font-semibold leading-5 tabular-nums">{value}</p>
      <p className="truncate text-[10px] leading-4 text-muted-foreground">{note}</p>
    </div>
  )
}
