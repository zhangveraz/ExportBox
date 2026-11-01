// 名称: 货代账单明细编辑表
// 描述: 录入费用名称、费用类型、实际收费与核价基准（紧凑版）
// 路径: ExportBox/app/tools/freight-charge-audit/freight-audit-table.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Plus, ReceiptText, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CHARGE_CATEGORY_OPTIONS, type ChargeCategory, type FreightAuditCurrency } from '@/lib/tools/freight-charge-audit'
import type { EditableChargeLine } from './freight-audit-page-data'

interface FreightAuditTableProps {
  currency: FreightAuditCurrency
  lines: EditableChargeLine[]
  onAdd: () => void
  onRemove: (id: string) => void
  onChange: (id: string, field: keyof Omit<EditableChargeLine, 'id'>, value: string) => void
}

export function FreightAuditTable({ currency, lines, onAdd, onRemove, onChange }: FreightAuditTableProps) {
  return (
    <Card className="min-w-0 gap-0 py-0">
      <CardHeader className="px-3 pt-3 pb-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold"><ReceiptText className="h-4 w-4" />账单明细</p>
            <p className="truncate text-[10px] text-muted-foreground" title="基准价填写同港口、同票型或柜型、同货量的同行价或约定价格">基准价填写同港口、同票型、同货量的同行价</p>
          </div>
          <Button type="button" size="sm" variant="outline" className="h-7 shrink-0 px-2 text-[11px]" onClick={onAdd}><Plus className="mr-1 h-3 w-3" />添加</Button>
        </div>
      </CardHeader>
      <CardContent className="min-w-0 px-3 pt-0 pb-3">
        {lines.length === 0 ? (
          <div className="flex min-h-24 flex-col items-center justify-center rounded-md border border-dashed text-center"><ReceiptText className="mb-2 h-6 w-6 text-muted-foreground" /><p className="text-[12px] font-medium">暂无费用明细</p><Button type="button" variant="link" size="sm" className="h-6 text-[11px]" onClick={onAdd}>添加第一项费用</Button></div>
        ) : (
          <div className="w-full max-w-full overflow-x-auto">
            <div className="min-w-[680px] space-y-1.5">
              <div className="grid grid-cols-[1.1fr_1.2fr_130px_130px_32px] gap-1.5 px-1 text-[10px] font-medium text-muted-foreground"><span>账单项目</span><span>费用类型</span><span>实际收费 ({currency})</span><span>基准价 ({currency})</span><span className="sr-only">操作</span></div>
              {lines.map((line) => (
                <div key={line.id} className="grid grid-cols-[1.1fr_1.2fr_130px_130px_32px] items-center gap-1.5 rounded-md border bg-background px-1 py-1">
                  <Input aria-label="账单项目" value={line.name} placeholder="如：THC" onChange={(event) => onChange(line.id, 'name', event.target.value)} className="h-7 text-[12px]" />
                  <Select value={line.category} onValueChange={(value) => onChange(line.id, 'category', value as ChargeCategory)}><SelectTrigger aria-label="费用类型" className="h-7 text-[12px]"><SelectValue /></SelectTrigger><SelectContent>{CHARGE_CATEGORY_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>
                  <Input aria-label="实际收费" type="text" inputMode="decimal" value={line.actual} placeholder="0" onChange={(event) => onChange(line.id, 'actual', event.target.value)} className="h-7 text-[12px] tabular-nums" />
                  <Input aria-label="基准价" type="text" inputMode="decimal" value={line.benchmark} placeholder="未询价" onChange={(event) => onChange(line.id, 'benchmark', event.target.value)} className="h-7 text-[12px] tabular-nums" />
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="删除费用" aria-label={`删除 ${line.name || '费用'}`} onClick={() => onRemove(line.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
