// 名称: 工具场景预设
// 描述: 为计算类工具提供一致的外贸常用场景入口
// 路径: ExportBox/components/tools/scenario-presets.tsx
// 作者: ExportBox
// 更新时间: 2026-07-24

import { Button } from '@/components/ui/button'

export interface ScenarioPreset<TValues> {
  label: string
  description: string
  values: TValues
}

interface ScenarioPresetsProps<TValues> {
  presets: readonly ScenarioPreset<TValues>[]
  onSelect: (values: TValues) => void
}

export function ScenarioPresets<TValues>({ presets, onSelect }: ScenarioPresetsProps<TValues>) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-medium leading-4 text-muted-foreground">常用场景（点击一键填入）</p>
      <div className="flex flex-wrap gap-1">
        {presets.map((preset) => (
          <Button key={preset.label} type="button" variant="outline" title={preset.description} onClick={() => onSelect(preset.values)} className="h-6 px-2 text-[11px]">
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
