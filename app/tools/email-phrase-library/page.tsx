// 名称: 外贸邮件话术库（紧凑版）
// 描述: 单屏布局：左侧场景导航 + 右侧话术卡片，支持关键词过滤与一键复制
// 路径: ExportBox/app/tools/email-phrase-library/page.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { ToolShell } from '@/components/tools/tool-shell'
import { cn } from '@/lib/utils'
import { EMAIL_PHRASE_SCENARIOS, searchPhrases } from './email-phrase-data'

export default function EmailPhraseLibraryPage() {
  const [scenarioId, setScenarioId] = useState(EMAIL_PHRASE_SCENARIOS[0].id)
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(() => searchPhrases(EMAIL_PHRASE_SCENARIOS, keyword), [keyword])
  const activeScenario = filtered.find((scenario) => scenario.id === scenarioId) ?? filtered[0]

  return (
    <ToolShell
      title="外贸邮件话术库"
      description="常用外贸英文邮件模板，覆盖开发、报价、订单、收款与售后场景，占位符替换后即可发送"
      onReset={() => {
        setKeyword('')
        setScenarioId(EMAIL_PHRASE_SCENARIOS[0].id)
      }}
    >
      {/* 搜索条 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索场景或话术关键词，如 催款 / quotation / inspection"
          className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[13px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:focus:border-blue-400/60 dark:focus:ring-blue-400/20"
        />
      </div>

      {!activeScenario ? (
        <p className="mt-3 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/15">
          没有匹配“{keyword}”的话术，试试其他关键词
        </p>
      ) : (
        <div className="mt-3 grid items-start gap-3 xl:grid-cols-[200px_minmax(0,1fr)]">
          {/* 左：场景导航 */}
          <nav className="flex flex-wrap gap-1.5 xl:sticky xl:top-20 xl:flex-col xl:flex-nowrap">
            {EMAIL_PHRASE_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setScenarioId(scenario.id)}
                className={cn(
                  'rounded-md border px-2 py-1 text-left text-[11px] font-medium transition-colors xl:text-xs',
                  activeScenario.id === scenario.id
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-white/15 dark:text-slate-300'
                )}
              >
                {scenario.label}
              </button>
            ))}
          </nav>

          {/* 右：话术卡片 */}
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{activeScenario.description}</p>
            <div className="mt-2 grid gap-3 2xl:grid-cols-2">
              {activeScenario.phrases.map((phrase) => (
                <div key={phrase.id} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-[13px] font-semibold text-slate-900 dark:text-white" title={phrase.subject}>
                        {phrase.subject}
                      </h3>
                      <p className="truncate text-[11px] text-slate-400 dark:text-slate-500" title={phrase.note}>{phrase.note}</p>
                    </div>
                  </div>
                  <pre className="mt-2 max-h-52 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-2.5 font-mono text-[11px] leading-relaxed text-slate-700 dark:bg-white/5 dark:text-slate-200">
{phrase.body}
                  </pre>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <EnhancedCopyButton text={phrase.body} variant="outline" size="sm" className="h-7 px-2.5 text-xs">复制正文</EnhancedCopyButton>
                    <EnhancedCopyButton text={phrase.subject.replace('Subject: ', '')} variant="ghost" size="sm" className="h-7 px-2.5 text-xs">复制主题</EnhancedCopyButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolShell>
  )
}
