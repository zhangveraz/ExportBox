// 名称: FOB/CIF 货代收费核对参数
// 描述: 展示贸易条款、币种、容差和演示场景控件（紧凑版）
// 路径: ExportBox/app/tools/freight-charge-audit/freight-audit-controls.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Info, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FREIGHT_AUDIT_PARTY_LABELS, type FreightAuditCurrency, type FreightAuditParty, type FreightTradeTerm } from '@/lib/tools/freight-charge-audit'
import { EMPTY_AUDIT_PRESET, FREIGHT_AUDIT_PRESETS, type FreightAuditPreset } from './freight-audit-page-data'

interface FreightAuditControlsProps {
  term: FreightTradeTerm
  auditParty: FreightAuditParty
  currency: FreightAuditCurrency
  tolerancePercent: string
  onTermChange: (value: FreightTradeTerm) => void
  onAuditPartyChange: (value: FreightAuditParty) => void
  onCurrencyChange: (value: FreightAuditCurrency) => void
  onToleranceChange: (value: string) => void
  onPreset: (preset: FreightAuditPreset) => void
  onReset: () => void
}

export function FreightAuditControls(props: FreightAuditControlsProps) {
  const boundary = props.term === 'CIF' && props.auditParty === 'buyer'
    ? '目的港操作、换单、拆箱、进口清关和派送通常由客户承担，但价格仍需与目的港代理报价比较，避免到港后投诉。'
    : props.term === 'FOB'
    ? '卖方通常承担出口清关及货物装船前费用；国际海运、保险、目的港和进口费用通常由买方承担。'
    : '卖方通常承担出口清关、装船、国际海运和最低保险；目的港操作、进口清关与税费通常仍由买方承担。'

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-3 pt-3 pb-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><SlidersHorizontal className="h-4 w-4" />核价口径</CardTitle>
            <p className="text-[10px] text-muted-foreground">{props.auditParty === 'seller' ? '核对出口卖方收到的起运端或主运账单' : '核对海外客户收到或将支付的目的港账单'}</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="h-7 shrink-0 px-2 text-[11px]" onClick={props.onReset}><RotateCcw className="mr-1 h-3 w-3" />重置</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 sm:grid-cols-4">
          <div className="space-y-1"><Label className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">贸易条款</Label><Tabs value={props.term} onValueChange={(value) => props.onTermChange(value as FreightTradeTerm)}><TabsList className="grid h-8 w-full grid-cols-2 p-0.5"><TabsTrigger value="FOB" className="h-7 text-[11px]">FOB</TabsTrigger><TabsTrigger value="CIF" className="h-7 text-[11px]">CIF</TabsTrigger></TabsList></Tabs></div>
          <div className="space-y-1"><Label className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">核对账单对象</Label><Tabs value={props.auditParty} onValueChange={(value) => props.onAuditPartyChange(value as FreightAuditParty)}><TabsList className="grid h-8 w-full grid-cols-2 p-0.5"><TabsTrigger value="seller" className="h-7 text-[11px]">出口卖方</TabsTrigger><TabsTrigger value="buyer" className="h-7 text-[11px]">海外客户</TabsTrigger></TabsList></Tabs></div>
          <div className="space-y-1"><Label htmlFor="audit-currency" className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">账单币种</Label><Select value={props.currency} onValueChange={(value) => props.onCurrencyChange(value as FreightAuditCurrency)}><SelectTrigger id="audit-currency" className="h-8 text-[13px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="CNY">CNY 人民币</SelectItem><SelectItem value="USD">USD 美元</SelectItem></SelectContent></Select></div>
          <div className="space-y-1"><Label htmlFor="audit-tolerance" className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">允许浮动</Label><div className="relative"><Input id="audit-tolerance" type="text" inputMode="decimal" value={props.tolerancePercent} onChange={(event) => props.onToleranceChange(event.target.value)} className="h-8 pr-7 text-[13px] tabular-nums" /><span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">%</span></div></div>
        </div>
        <div className="space-y-1"><Label className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">常见账单</Label><div className="flex flex-wrap gap-1.5">{FREIGHT_AUDIT_PRESETS.map((preset) => <Button key={preset.label} type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]" title={preset.description} onClick={() => props.onPreset(preset)}>{preset.label}</Button>)}<Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={() => props.onPreset(EMPTY_AUDIT_PRESET)}>清空账单</Button></div></div>
        <Alert className="px-2.5 py-1.5"><Info className="h-3.5 w-3.5" /><AlertDescription className="text-[10px] leading-4"><strong>{props.term} · {FREIGHT_AUDIT_PARTY_LABELS[props.auditParty]}：</strong>{boundary} 实际合同、订舱委托与异常原因优先。</AlertDescription></Alert>
      </CardContent>
    </Card>
  )
}
