// 名称: 快递专线货代报价表单（紧凑版）
// 描述: 三张渠道卡片并排：运输方式、报价范围、泡重口径、报价方式、时效与附加费
// 路径: ExportBox/app/tools/express-channel-comparison/express-quote-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { BadgeDollarSign, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { ExpressPricingMode, ExpressServiceType, ExpressTradeTerm } from '@/lib/tools/express-channel-comparison'
import {
  PRICING_MODE_OPTIONS,
  SERVICE_OPTIONS,
  TRADE_TERM_OPTIONS,
  type ChannelForm,
  type ChannelNumericField,
} from './express-comparison-page-data'

interface ExpressQuoteFormProps {
  channels: ChannelForm[]
  onNameChange: (id: string, value: string) => void
  onServiceChange: (id: string, value: ExpressServiceType) => void
  onTradeTermChange: (id: string, value: ExpressTradeTerm) => void
  onPricingModeChange: (id: string, value: ExpressPricingMode) => void
  onNumericChange: (id: string, field: ChannelNumericField, value: string) => void
}

const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

export function ExpressQuoteForm(props: ExpressQuoteFormProps) {
  return (
    <div className={panelClass}>
      <div className="flex items-center gap-1.5">
        <BadgeDollarSign className="h-4 w-4 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">货代报价</h2>
        <span className="ml-auto truncate text-[11px] text-slate-400 dark:text-slate-500">分别保留每个渠道的重量口径与责任范围</span>
      </div>

      <div className="mt-2.5 grid gap-2.5 xl:grid-cols-3">
        {props.channels.map((channel) => (
          <ChannelPanel key={channel.id} channel={channel} {...props} />
        ))}
      </div>
    </div>
  )
}

function ChannelPanel(props: ExpressQuoteFormProps & { channel: ChannelForm }) {
  const { channel } = props
  const quoteLabel = channel.pricingMode === 'per-kg' ? '货代单价' : '整票报价'
  const quoteSuffix = channel.pricingMode === 'per-kg' ? '元/kg' : '元'
  const hasSeparateFees = channel.pricingMode !== 'all-in'

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 dark:border-white/10 dark:bg-white/5">
      <label htmlFor={`${channel.id}-name`} className="block">
        <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">货代 / 渠道名称</span>
        <Input
          id={`${channel.id}-name`}
          value={channel.name}
          onChange={(event) => props.onNameChange(channel.id, event.target.value)}
          className="h-8 text-[13px] font-semibold"
        />
      </label>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <SelectField
          id={`${channel.id}-service`}
          label="运输方式"
          value={channel.serviceType}
          options={SERVICE_OPTIONS}
          onChange={(value) => props.onServiceChange(channel.id, value as ExpressServiceType)}
        />
        <SelectField
          id={`${channel.id}-term`}
          label="报价范围"
          value={channel.tradeTerm}
          options={TRADE_TERM_OPTIONS}
          onChange={(value) => props.onTradeTermChange(channel.id, value as ExpressTradeTerm)}
        />
        <MiniField id={`${channel.id}-divisor`} label="泡重系数" suffix="cm³/kg" value={channel.divisor} field="divisor" onChange={props.onNumericChange} channelId={channel.id} />
        <MiniField id={`${channel.id}-quote`} label={quoteLabel} suffix={quoteSuffix} value={channel.quoteAmountCny} field="quoteAmountCny" onChange={props.onNumericChange} channelId={channel.id} />
      </div>

      {/* 报价方式：三个按钮直选 */}
      <div className="mt-2">
        <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">报价方式</span>
        <div className="grid grid-cols-3 gap-1">
          {PRICING_MODE_OPTIONS.map((option) => {
            const active = channel.pricingMode === option.value
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => props.onPricingModeChange(channel.id, option.value as ExpressPricingMode)}
                className={cn(
                  'rounded-md border px-1 py-1 text-[11px] leading-4 transition-colors',
                  active
                    ? 'border-blue-600 bg-blue-600 font-medium text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-white/15 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <MiniField id={`${channel.id}-transitMin`} label="最快时效" suffix="天" value={channel.transitDaysMin} field="transitDaysMin" onChange={props.onNumericChange} channelId={channel.id} />
        <MiniField id={`${channel.id}-transitMax`} label="最慢时效" suffix="天" value={channel.transitDaysMax} field="transitDaysMax" onChange={props.onNumericChange} channelId={channel.id} />
      </div>

      {hasSeparateFees ? (
        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-200/70 pt-2 dark:border-white/10">
          <MiniField id={`${channel.id}-fuel`} label="燃油附加" suffix="%" value={channel.fuelRatePercent} field="fuelRatePercent" onChange={props.onNumericChange} channelId={channel.id} />
          <MiniField id={`${channel.id}-remote`} label="偏远附加" suffix="元" value={channel.remoteFeeCny} field="remoteFeeCny" onChange={props.onNumericChange} channelId={channel.id} />
          <MiniField id={`${channel.id}-customs`} label="报关/操作" suffix="元" value={channel.customsFeeCny} field="customsFeeCny" onChange={props.onNumericChange} channelId={channel.id} />
          <MiniField id={`${channel.id}-other`} label="其他附加" suffix="元" value={channel.otherFeeCny} field="otherFeeCny" onChange={props.onNumericChange} channelId={channel.id} />
        </div>
      ) : (
        <p className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          整票一口价即最终费用，不再叠加附加费。
        </p>
      )}
    </section>
  )
}

function SelectField({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-8 px-2 text-[13px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}

function MiniField({
  id,
  label,
  suffix,
  value,
  field,
  onChange,
  channelId,
}: {
  id: string
  label: string
  suffix: string
  value: string
  field: ChannelNumericField
  onChange: (id: string, field: ChannelNumericField, value: string) => void
  channelId: string
}) {
  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="mb-1 block truncate text-[11px] text-slate-500 dark:text-slate-400" title={label}>{label}</span>
      <span className="relative block">
        <Input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(channelId, field, event.target.value)}
          className="h-8 pl-2 pr-14 text-[13px] font-medium tabular-nums"
        />
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400">{suffix}</span>
      </span>
    </label>
  )
}
