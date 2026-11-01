// 名称: JSON 格式化与转换
// 描述: 验证、格式化、压缩 JSON 及转换为 CSV 等格式
// 路径: ExportBox/app/tools/json-formatter/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { ToolShell } from '@/components/tools/tool-shell'
import JSONFormatterTool from './json-formatter-tool'

export default function JSONFormatterPage() {
  return (
    <ToolShell title="JSON 格式化与转换" description="验证、格式化、压缩 JSON，并可与 CSV 互相转换，便于数据导入导出">
      <JSONFormatterTool />
    </ToolShell>
  )
}
