// 名称: 特殊字符说明面板
// 描述: 折叠展示功能、使用场景和常见字符类型
// 路径: ExportBox/app/tools/special-char/special-char-info.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Info } from 'lucide-react'

const INFO_GROUPS = [
  {
    title: '功能说明',
    items: ['自动检测中英文标点、特殊符号等', '智能替换：将特殊字符替换为相近的标准字符', '完全清理：只保留标准 ASCII 字符，适合纯英文环境', '实时统计各类特殊字符数量', '保存最近 5 次检查历史记录'],
  },
  {
    title: '使用场景',
    items: ['邮件发送前的文本检查', '跨系统文档传输', '数据库录入前的清理', 'API 接口数据处理', 'Excel / CSV 文件导入', '国际化内容处理'],
  },
]

const CHARACTER_GROUPS = [
  ['中文标点符号', '，。！？、；：""\'\'（）【】《》'],
  ['货币符号', '￥ $ € £ ¥ ₹ ₽ ₩ ₪'],
  ['商标版权符号', '™ ® © ℃ ℉ § † ‡ №'],
  ['其他特殊符号', '… — – ° ± × ÷ ≈ ≠ ≤ ≥'],
]

export function SpecialCharInfo() {
  return (
    <details className="mt-3 rounded-lg border px-3 py-1.5 text-[11px] leading-5">
      <summary className="cursor-pointer list-none font-medium text-foreground/80">功能说明、使用场景与常见字符类型</summary>
      <div className="mt-1.5 space-y-2 border-t pt-2">
        <div className="grid gap-3 md:grid-cols-2">
          {INFO_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="flex items-center gap-1 pb-0.5 text-[11px] font-semibold text-foreground"><Info className="h-3.5 w-3.5" />{group.title}</p>
              <div className="space-y-0.5 text-muted-foreground">{group.items.map((item) => <p key={item}>· {item}</p>)}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-1 border-t pt-1.5 sm:grid-cols-2">
          {CHARACTER_GROUPS.map(([title, content]) => (
            <p key={title} className="truncate"><span className="font-medium text-foreground">{title}：</span><span className="font-mono text-muted-foreground">{content}</span></p>
          ))}
        </div>
      </div>
    </details>
  )
}
