// 名称: 全球货币符号大全
// 描述: 查看和复制全球各国货币符号，便于外贸报价和合同编写
// 路径: ExportBox/app/tools/currency-symbols/page.tsx
// 作者: ExportBox
// 更新时间: 2026-07-15

'use client'

import { useState } from 'react'
import { useStoredStringArray } from '@/lib/client-hooks'
import { CurrencyControls } from './currency-controls'
import { CurrencyReference, CurrencyStats } from './currency-info-panels'
import { CurrencyList } from './currency-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToolShell } from '@/components/tools/tool-shell'
import { getCurrencyData, type Currency } from '@/lib/tools/currency-symbols'

export default function CurrencySymbolsPage() {
  const [currencies] = useState<Currency[]>(() => getCurrencyData())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [favorites, setFavorites] = useStoredStringArray('currencyFavorites')
  const [showOnlyPopular, setShowOnlyPopular] = useState(false)

  const toggleFavorite = (code: string) => {
    setFavorites((current) => current.includes(code) ? current.filter((favorite) => favorite !== code) : [...current, code])
  }
  const normalizedSearchTerm = searchTerm.toLowerCase()
  const filteredCurrencies = currencies.filter((currency) => {
    const matchesSearch = currency.code.toLowerCase().includes(normalizedSearchTerm)
      || currency.name.toLowerCase().includes(normalizedSearchTerm)
      || currency.nameEn.toLowerCase().includes(normalizedSearchTerm)
      || currency.country.toLowerCase().includes(normalizedSearchTerm)
      || currency.countryEn.toLowerCase().includes(normalizedSearchTerm)
      || currency.symbol.includes(searchTerm)
    const matchesRegion = selectedRegion === 'all'
      || (selectedRegion === 'favorites' && favorites.includes(currency.code))
      || currency.region === selectedRegion
    return matchesSearch && matchesRegion && (!showOnlyPopular || currency.popular)
  })
  const groupedCurrencies = filteredCurrencies.reduce<Record<string, Currency[]>>((groups, currency) => {
    if (!groups[currency.region]) groups[currency.region] = []
    groups[currency.region].push(currency)
    return groups
  }, {})

  return (
    <ToolShell title="全球货币符号大全" description="查看和复制全球货币符号，覆盖主要贸易国家和长尾市场">
      
      <CurrencyStats
        totalCount={currencies.length}
        popularCount={currencies.filter((currency) => currency.popular).length}
        tradingCount={currencies.filter((currency) => currency.trading).length}
        favoriteCount={favorites.length}
      />
      <Card className="gap-0 py-0">
        <CardHeader className="px-3 pt-2.5 pb-1.5">
          <CardTitle className="text-sm font-semibold">货币符号查询</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-3 pt-0 pb-3">
          <CurrencyControls
            selectedRegion={selectedRegion}
            searchTerm={searchTerm}
            favoriteCount={favorites.length}
            showOnlyPopular={showOnlyPopular}
            onRegionChange={setSelectedRegion}
            onSearchChange={setSearchTerm}
            onTogglePopular={() => setShowOnlyPopular((value) => !value)}
          />
          <div className="max-h-[560px] overflow-y-auto pr-1">
            <CurrencyList
              groupedCurrencies={groupedCurrencies}
              filteredCount={filteredCurrencies.length}
              selectedRegion={selectedRegion}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </CardContent>
      </Card>
      <CurrencyReference />
    </ToolShell>
  )
}
