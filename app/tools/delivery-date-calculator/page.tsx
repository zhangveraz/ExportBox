// 名称: 外贸交期计算器页面
// 描述: 以 Asia/Shanghai 业务日期初始化交期计算器
// 路径: ExportBox/app/tools/delivery-date-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-07-21

import { DeliveryDateTool } from './delivery-date-tool'
import { getDateKeyInTimeZone } from '@/lib/tools/delivery-date-calculator'
import { ToolShell } from '@/components/tools/tool-shell'

export default function DeliveryDateCalculatorPage() {
  return <ToolShell title="外贸交期计算器" description="按生产、运输和缓冲周期推算交付日期，支持工作日与国家公共假日口径"><DeliveryDateTool defaultStartDate={getDateKeyInTimeZone(new Date())} /></ToolShell>
}
