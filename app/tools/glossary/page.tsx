// 名称: 外贸术语库页面
// 描述: 术语对照 / Incoterms 2020 / 邮件句式 / 缩写速查四合一，支持收藏与导出
// 路径: ExportBox/app/tools/glossary/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { ToolShell } from '@/components/tools/tool-shell'
import { GLOSSARY_ABBR, GLOSSARY_PHRASES, GLOSSARY_TERMS } from '@/lib/tools/glossary-data'
import { INCOTERMS_2020 } from '@/lib/tools/incoterms'

import { GlossaryBrowser } from './glossary-browser'

export default function GlossaryPage() {
  return (
    <ToolShell
      title="外贸术语库"
      description={`${GLOSSARY_TERMS.length} 条术语中英对照 · ${INCOTERMS_2020.length} 条贸易术语（Incoterms 2020）· ${GLOSSARY_PHRASES.length} 条邮件句式 · ${GLOSSARY_ABBR.length} 个常用缩写；可收藏常忘的条目，支持只看收藏 / 只导出收藏。`}
    >
      <GlossaryBrowser />
    </ToolShell>
  )
}
