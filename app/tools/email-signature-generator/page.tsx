// 名称: 邮件签名生成器
// 描述: 实时生成邮件客户端兼容的 HTML 签名与纯文本签名
// 路径: ExportBox/app/tools/email-signature-generator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-10-10

'use client'

import { useMemo, useState } from 'react'
import { Code2, Copy, Type } from 'lucide-react'
import { ToolShell } from '@/components/tools/tool-shell'
import { EnhancedAlert } from '@/components/ui/enhanced-alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { generateEmailSignature } from '@/lib/tools/email-signature-generator'
import { EmailSignatureForm, type SignatureFormState } from './email-signature-form'

function createInitialForm(): SignatureFormState {
  return {
    name: 'Vera Zhang',
    title: 'Sales Manager',
    company: 'ExportBox Trading Co., Ltd.',
    phone: '+86 574 8888 6666',
    mobile: '+86 138 0000 0000',
    email: 'hello@ExportBox.com',
    website: 'www.ExportBox.com',
    address: 'No. 88 Zhongshan East Road, Ningbo, Zhejiang, China',
    whatsapp: '+86 138 0000 0000',
    logoUrl: '',
  }
}

export default function EmailSignatureGeneratorPage() {
  const [form, setForm] = useState<SignatureFormState>(createInitialForm)

  const computation = useMemo<{ html: string; text: string; error: string }>(() => {
    try {
      const signature = generateEmailSignature(form)
      return { html: signature.html, text: signature.text, error: '' }
    } catch (error) {
      return { html: '', text: '', error: error instanceof Error ? error.message : '签名无法生成，请检查输入' }
    }
  }, [form])

  return (
    <ToolShell title="外贸邮件签名生成器" description="生成 Outlook、Foxmail、Gmail 兼容的 table 内联样式签名，输入自动转义防注入，复制 HTML 源码粘贴到邮件客户端签名设置即可。">
      

      {computation.error && <EnhancedAlert type="error" title="生成失败" message={computation.error} action={{ label: '重置', onClick: () => setForm(createInitialForm()) }} className="mb-2.5" />}

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <EmailSignatureForm
          form={form}
          onChange={(patch) => setForm((current) => ({ ...current, ...patch }))}
          onReset={() => setForm(createInitialForm())}
        />

        <div className="space-y-3">
          {computation.error ? (
            <div className="rounded-md border border-dashed p-6 text-center text-[11px] text-muted-foreground">修正表单后查看签名预览</div>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
                  <div className="min-w-0">
                    <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><Type className="h-3.5 w-3.5" />签名预览</CardTitle>
                    <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground">邮件客户端中的实际效果（白底模拟）</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <EnhancedCopyButton text={computation.html} variant="outline" className="h-6 px-2 text-[10px]"><Copy className="mr-1 h-3 w-3" />HTML</EnhancedCopyButton>
                    <EnhancedCopyButton text={computation.text} variant="ghost" className="h-6 px-2 text-[10px]">纯文本</EnhancedCopyButton>
                  </div>
                </CardHeader>
                <CardContent className="px-3 pt-0 pb-3">
                  <div className="rounded-md border bg-white p-3">
                    <div dangerouslySetInnerHTML={{ __html: computation.html }} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
                  <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><Code2 className="h-3.5 w-3.5" />HTML 源码</CardTitle>
                  <span className="text-[10px] text-muted-foreground">粘贴到客户端签名编辑器（源码模式）</span>
                </CardHeader>
                <CardContent className="px-3 pt-0 pb-3">
                  <pre className="max-h-40 overflow-auto rounded-md border bg-white p-2 font-mono text-[10px] leading-4 text-slate-700 dark:bg-slate-950 dark:text-slate-300">{computation.html}</pre>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </ToolShell>
  )
}
