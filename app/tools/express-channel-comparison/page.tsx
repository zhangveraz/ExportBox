// 名称: 国际快递专线报价对比
// 描述: 按箱规、重量、运输方式和货代报价口径对比空运、快递与 DDP 专线
// 路径: ExportBox/app/tools/express-channel-comparison/page.tsx
// 作者: ExportBox
// 更新时间: 2026-07-24

'use client'

import { useMemo, useState } from 'react'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { ToolShell } from '@/components/tools/tool-shell'
import {
  compareExpressChannels,
  EXPRESS_PRICING_MODE_LABELS,
  EXPRESS_SERVICE_LABELS,
  EXPRESS_TRADE_TERM_LABELS,
  type ExpressPricingMode,
  type ExpressServiceType,
  type ExpressTradeTerm,
} from '@/lib/tools/express-channel-comparison'
import { ExpressComparisonResults, ExpressComparisonStats, ExpressWeightSummary } from './express-comparison-results'
import {
  CARGO_TYPE_OPTIONS,
  INITIAL_CHANNELS,
  INITIAL_SHIPMENT,
  SERVICE_OPTIONS,
  formatNumber,
  money,
  toNumber,
  type CargoType,
  type ChannelForm,
  type ChannelNumericField,
  type ShipmentForm,
  type ShipmentNumericField,
  type ShipmentTextField,
} from './express-comparison-page-data'
import { ExpressQuoteForm } from './express-quote-form'
import { ExpressShipmentForm } from './express-shipment-form'

export default function ExpressChannelComparisonPage() {
  const [shipment, setShipment] = useState<ShipmentForm>(INITIAL_SHIPMENT)
  const [channels, setChannels] = useState<ChannelForm[]>(INITIAL_CHANNELS)
  const inputs = useMemo(() => ({
    lengthCm: toNumber(shipment.lengthCm), widthCm: toNumber(shipment.widthCm), heightCm: toNumber(shipment.heightCm),
    grossWeightKg: toNumber(shipment.grossWeightKg), netWeightKg: toNumber(shipment.netWeightKg), packageCount: toNumber(shipment.packageCount),
    channels: channels.map((channel) => ({
      ...channel,
      divisor: toNumber(channel.divisor), quoteAmountCny: toNumber(channel.quoteAmountCny), fuelRatePercent: toNumber(channel.fuelRatePercent),
      remoteFeeCny: toNumber(channel.remoteFeeCny), customsFeeCny: toNumber(channel.customsFeeCny), otherFeeCny: toNumber(channel.otherFeeCny),
      transitDaysMin: toNumber(channel.transitDaysMin), transitDaysMax: toNumber(channel.transitDaysMax),
    })),
  }), [shipment, channels])
  const results = useMemo(() => compareExpressChannels(inputs), [inputs])

  const updateShipment = (field: ShipmentTextField | ShipmentNumericField, value: string) => setShipment((current) => ({ ...current, [field]: value }))
  const updateChannel = <K extends keyof ChannelForm>(id: string, field: K, value: ChannelForm[K]) => setChannels((current) => current.map((channel) => channel.id === id ? { ...channel, [field]: value } : channel))
  const updateService = (id: string, serviceType: ExpressServiceType) => {
    const divisor = SERVICE_OPTIONS.find((option) => option.value === serviceType)?.divisor ?? 6000
    setChannels((current) => current.map((channel) => channel.id === id ? {
      ...channel,
      serviceType,
      divisor: String(divisor),
      ...(serviceType === 'ddp-line' ? { tradeTerm: 'DDP' as const } : {}),
    } : channel))
  }
  const reset = () => { setShipment(INITIAL_SHIPMENT); setChannels(INITIAL_CHANNELS) }
  const copySummary = () => {
    const cargoType = CARGO_TYPE_OPTIONS.find((option) => option.value === shipment.cargoType)?.label ?? '未填写'
    const lines = [
      '国际快递/专线报价对比',
      `货物：${shipment.cargoName || '未填写'}（${cargoType}）`,
      `目的地：${shipment.destination || '未填写'}`,
      `箱规：${shipment.lengthCm} × ${shipment.widthCm} × ${shipment.heightCm} cm，${shipment.packageCount} 箱`,
      `单箱毛重/净重：${shipment.grossWeightKg}/${shipment.netWeightKg} kg`,
      ...results.map((row) => [
        '', `${row.name}：${EXPRESS_SERVICE_LABELS[row.serviceType]}，${EXPRESS_TRADE_TERM_LABELS[row.tradeTerm]}`,
        `报价方式：${EXPRESS_PRICING_MODE_LABELS[row.pricingMode]}`,
        `重量口径：/${formatNumber(row.divisor, 0)}，${row.billingBasis === 'volumetric' ? '按体积重' : '按实重'} ${formatNumber(row.chargeableWeightKg)} kg`,
        `费用：${money.format(row.totalCostCny)}，折合 ${money.format(row.perKgCny)}/kg`,
        `时效：${row.transitDaysMin}-${row.transitDaysMax} 天`,
      ].join('\n')),
    ]
    return lines.join('\n')
  }

  return (
    <ToolShell
      title="国际快递/专线报价对比"
      description="自动判断实重或体积重，并区分空运、商业快递、DDP 专线及货代报价方式"
      onReset={reset}
    >
      <div className="space-y-2.5">
        {/* 顶部四格概览，与其余工具保持同一视觉节奏 */}
        <ExpressComparisonStats results={results} />

        {/* 上排：左边录货物，右边是泡重口径与对比表，1080p 下左右均衡 */}
        <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-2.5">
            <ExpressShipmentForm
              form={shipment}
              onTextChange={updateShipment}
              onNumericChange={updateShipment}
              onCargoTypeChange={(cargoType: CargoType) => setShipment((current) => ({ ...current, cargoType }))}
            />
          </div>

          <div className="space-y-2.5">
            <ExpressWeightSummary shipment={shipment} />
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[13px] font-semibold text-slate-900 dark:text-white">对比明细</h2>
              <EnhancedCopyButton text={copySummary()} disabled={!results.length} variant="outline" size="sm" className="h-7 px-2.5 text-[11px]">
                复制结果
              </EnhancedCopyButton>
            </div>
            <ExpressComparisonResults results={results} />
          </div>
        </div>

        {/* 通栏货代报价：三家渠道并排，宽度足够时一行放下更多字段，避免整页过高 */}
        <ExpressQuoteForm
          channels={channels}
          onNameChange={(id, value) => updateChannel(id, 'name', value)}
          onServiceChange={updateService}
          onTradeTermChange={(id, value: ExpressTradeTerm) => updateChannel(id, 'tradeTerm', value)}
          onPricingModeChange={(id, value: ExpressPricingMode) => updateChannel(id, 'pricingMode', value)}
          onNumericChange={(id, field: ChannelNumericField, value) => updateChannel(id, field, value)}
        />
      </div>
    </ToolShell>
  )
}
