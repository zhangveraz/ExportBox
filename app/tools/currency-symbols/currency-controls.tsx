// 名称: 货币查询控件
// 描述: 展示地区、主要货币与关键词筛选控件（紧凑单行版）
// 路径: ExportBox/app/tools/currency-symbols/currency-controls.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Search, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CURRENCY_REGIONS } from '@/lib/tools/currency-symbols'

interface CurrencyControlsProps {
  selectedRegion: string
  searchTerm: string
  favoriteCount: number
  showOnlyPopular: boolean
  onRegionChange: (value: string) => void
  onSearchChange: (value: string) => void
  onTogglePopular: () => void
}

export function CurrencyControls(props: CurrencyControlsProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input id="search" type="text" placeholder="搜索货币代码、名称、符号或国家…" value={props.searchTerm} onChange={(event) => props.onSearchChange(event.target.value)} className="h-8 pl-8 text-[13px]" />
        </div>
        <Button variant={props.showOnlyPopular ? 'default' : 'outline'} size="sm" onClick={props.onTogglePopular} className="h-8 shrink-0 px-2.5 text-xs">
          <TrendingUp className="mr-1 h-3.5 w-3.5" />主要货币
        </Button>
      </div>
      <Tabs value={props.selectedRegion} onValueChange={props.onRegionChange}>
        <TabsList className="h-auto flex-nowrap gap-0.5 overflow-x-auto bg-muted/60 p-0.5">
          <TabsTrigger value="all" className="h-5 shrink-0 px-1.5 text-[10px]">全部</TabsTrigger>
          <TabsTrigger value="favorites" className="h-5 shrink-0 px-1.5 text-[10px]">收藏{props.favoriteCount > 0 && `(${props.favoriteCount})`}</TabsTrigger>
          {Object.entries(CURRENCY_REGIONS).map(([key, name]) => <TabsTrigger key={key} value={key} className="h-5 shrink-0 px-1.5 text-[10px]">{name}</TabsTrigger>)}
        </TabsList>
      </Tabs>
    </div>
  )
}
