// 名称: 特殊字符检查结果
// 描述: 紧凑展示字符详情、分类统计和两种清理结果
// 路径: ExportBox/app/tools/special-char/special-char-result.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { SpecialCharResult } from '@/lib/tools/special-char'
import type { SpecialCharStats } from './special-char-data'

interface SpecialCharResultProps {
  result: SpecialCharResult
  stats: SpecialCharStats
}

const STAT_LABELS: Array<[keyof SpecialCharStats, string]> = [
  ['chinese', '中文字符'],
  ['currency', '货币符号'],
  ['punctuation', '标点符号'],
  ['symbols', '特殊符号'],
  ['other', '其他字符'],
]

export function SpecialCharCheckResult({ result, stats }: SpecialCharResultProps) {
  return (
    <div className="space-y-3">
      <Alert variant={result.hasSpecialChars ? 'destructive' : 'default'} className="px-2.5 py-1.5">
        {result.hasSpecialChars ? <AlertCircle className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
        <AlertDescription className="text-[11px] font-medium leading-4">
          {result.hasSpecialChars ? `发现 ${result.specialChars.length} 个特殊字符，可能在某些系统中显示异常` : '未发现特殊字符，文本可以安全使用'}
        </AlertDescription>
      </Alert>

      {result.hasSpecialChars && (
        <>
          <Card>
            <CardHeader className="px-3 pt-2.5 pb-1.5">
              <CardTitle className="text-sm font-semibold">发现的特殊字符</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 pt-0 pb-3">
              <div className="flex max-h-16 flex-wrap gap-1 overflow-y-auto">
                {result.specialChars.map((char, index) => <Badge key={index} variant="destructive" className="h-5 min-w-5 justify-center px-1 font-mono text-[11px]">{char}</Badge>)}
              </div>
              <div className="grid grid-cols-5 gap-1.5 border-t pt-2">
                {STAT_LABELS.map(([key, label]) => (
                  <div key={key} className={`rounded-md px-1.5 py-1 text-center ${stats[key] > 0 ? 'bg-destructive/10' : 'bg-muted/40'}`}>
                    <p className="text-[13px] font-semibold leading-5 tabular-nums">{stats[key]}</p>
                    <p className="truncate text-[10px] leading-4 text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="smart" className="w-full">
            <TabsList className="grid h-7 w-full grid-cols-2">
              <TabsTrigger value="smart" className="text-[11px]">智能替换</TabsTrigger>
              <TabsTrigger value="clean" className="text-[11px]">完全清理</TabsTrigger>
            </TabsList>
            <ResultTab value="smart" title="智能替换结果" description="替换为相近的标准字符，保留原意" text={result.replacedText} />
            <ResultTab value="clean" title="完全清理结果" description="仅保留 ASCII 字符，适合纯英文环境" text={result.cleanedText} />
          </Tabs>
        </>
      )}
    </div>
  )
}

interface ResultTabProps {
  value: string
  title: string
  description: string
  text: string
}

function ResultTab({ value, title, description, text }: ResultTabProps) {
  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
          <div className="min-w-0">
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground">{description}</p>
          </div>
          <EnhancedCopyButton text={text} className="h-6 shrink-0 px-2 text-[11px]">复制</EnhancedCopyButton>
        </CardHeader>
        <CardContent className="px-3 pt-0 pb-3">
          <Textarea value={text} readOnly className="min-h-[132px] bg-muted font-mono text-[12px] leading-5" />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
