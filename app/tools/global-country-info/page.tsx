// 名称: 全球国家信息查询
// 描述: 查询世界各国的中英文名称、区号、代码、时区、域名等信息（单屏紧凑版）
// 路径: ExportBox/app/tools/global-country-info/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

'use client'

import { useMemo, useState } from 'react'
import { useLocalTimeZone, useStoredStringArray } from '@/lib/client-hooks'
import { ToolShell } from '@/components/tools/tool-shell'
import { CountryControls, MajorTradeCountries } from './country-controls'
import { CountryDetailModal } from './country-detail-modal'
import { exportCountriesCsv, filterAndSortCountries, type SortField, type SortOrder } from './country-page-data'
import { CountryTable } from './country-table'
import { CountryTips } from './country-tips'
import type { CountryInfo } from '@/lib/tools/global-country-info'

export default function GlobalCountryInfoPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [continentFilter, setContinentFilter] = useState('all')
  const [favorites, setFavorites] = useStoredStringArray('countryFavorites')
  const [sortField, setSortField] = useState<SortField>('none')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [showOnlyMajorTrade, setShowOnlyMajorTrade] = useState(false)
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null)
  const localTimezone = useLocalTimeZone()
  const countries = useMemo(() => filterAndSortCountries({ searchTerm, continentFilter, favorites, sortField, sortOrder, showOnlyFavorites, showOnlyMajorTrade, localTimezone }), [searchTerm, continentFilter, favorites, sortField, sortOrder, showOnlyFavorites, showOnlyMajorTrade, localTimezone])
  const toggleFavorite = (iso2: string) => {
    setFavorites((current) => current.includes(iso2) ? current.filter((favorite) => favorite !== iso2) : [...current, iso2])
  }
  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortOrder('asc') }
  }
  const toggleRow = (iso2: string) => setExpandedRows((rows) => rows.includes(iso2) ? rows.filter((row) => row !== iso2) : [...rows, iso2])

  return (
    <ToolShell title="全球国家信息查询" description="按国家名、代码、区号或大洲查找，含时差、货币、语言、域名与外贸注意事项，支持收藏与 CSV 导出。">
      <div className="space-y-2.5">
        <MajorTradeCountries showOnlyMajorTrade={showOnlyMajorTrade} onSelect={setSelectedCountry} onToggleFilter={() => setShowOnlyMajorTrade((value) => !value)} />
        <CountryControls
          searchTerm={searchTerm}
          continentFilter={continentFilter}
          showOnlyFavorites={showOnlyFavorites}
          resultCount={countries.length}
          favoriteCount={favorites.length}
          onSearch={setSearchTerm}
          onContinent={setContinentFilter}
          onToggleFavorites={() => setShowOnlyFavorites((value) => !value)}
          onExport={() => exportCountriesCsv(countries)}
        />
        <CountryTable
          countries={countries}
          favorites={favorites}
          expandedRows={expandedRows}
          sortField={sortField}
          sortOrder={sortOrder}
          localTimezone={localTimezone}
          onSort={handleSort}
          onToggleFavorite={toggleFavorite}
          onToggleRow={toggleRow}
          onSelect={setSelectedCountry}
        />
        <CountryTips />
        {selectedCountry && <CountryDetailModal country={selectedCountry} favorites={favorites} localTimezone={localTimezone} onToggleFavorite={toggleFavorite} onClose={() => setSelectedCountry(null)} />}
      </div>
    </ToolShell>
  )
}
