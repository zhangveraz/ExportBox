// 名称: 首页页尾装饰卡片
// 描述: 首屏最后一组三张淡彩卡片，用渐变、圆环与柔光做装饰，收束整个首页
// 路径: ExportBox/components/home/home-closing-cards.tsx
// 作者: ExportBox
// 更新时间: 2026-11-03

import { ShieldCheck, Smartphone, Workflow, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HOME_TOOLS } from './home-data'

type ClosingCard = {
  title: string
  caption: string
  icon: LucideIcon
  /** 卡片底色（淡彩渐变） */
  cardClassName: string
  /** 图标颜色 */
  iconClassName: string
  /** 图标外圈的描边 */
  ringClassName: string
  /** 右下角的柔光球 */
  glowClassName: string
}

/** 三张纯展示卡片：不参与计算，也不带跳转，只负责给首页收尾 */
const CLOSING_CARDS: ClosingCard[] = [
  {
    title: '本地计算',
    caption: '客户资料、报价和单证都在你自己的设备上算，不上传服务器。',
    icon: ShieldCheck,
    cardClassName:
      'border-blue-100 bg-linear-to-br from-blue-50 via-white to-white dark:border-blue-400/15 dark:from-blue-500/12 dark:via-slate-950/70 dark:to-slate-950/70',
    iconClassName: 'text-blue-600 dark:text-blue-300',
    ringClassName: 'ring-blue-100 dark:ring-blue-400/25',
    glowClassName: 'bg-blue-300/45 dark:bg-blue-500/20',
  },
  {
    title: `${HOME_TOOLS.length} 个工具`,
    caption: '顺着询盘到单证的业务流排好，第一次用也不用来回找。',
    icon: Workflow,
    cardClassName:
      'border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-white dark:border-emerald-400/15 dark:from-emerald-500/12 dark:via-slate-950/70 dark:to-slate-950/70',
    iconClassName: 'text-emerald-600 dark:text-emerald-300',
    ringClassName: 'ring-emerald-100 dark:ring-emerald-400/25',
    glowClassName: 'bg-emerald-300/45 dark:bg-emerald-500/20',
  },
  {
    title: '免注册',
    caption: '打开就能用，收藏和最近用过的工具会跟着你走。',
    icon: Smartphone,
    cardClassName:
      'border-cyan-100 bg-linear-to-br from-cyan-50 via-white to-white dark:border-cyan-400/15 dark:from-cyan-500/12 dark:via-slate-950/70 dark:to-slate-950/70',
    iconClassName: 'text-cyan-600 dark:text-cyan-300',
    ringClassName: 'ring-cyan-100 dark:ring-cyan-400/25',
    glowClassName: 'bg-cyan-300/45 dark:bg-cyan-500/20',
  },
]

export function HomeClosingCards() {
  return (
    <section aria-label="使用说明" className="grid gap-4 sm:grid-cols-3">
      {CLOSING_CARDS.map((card) => {
        const Icon = card.icon
        return (
          <article
            key={card.title}
            className={cn(
              'relative overflow-hidden rounded-2xl border p-5 shadow-lg shadow-slate-900/4 backdrop-blur-xl',
              card.cardClassName,
            )}
          >
            {/* 装饰层：右上角两层圆环 + 右下角一团柔光 */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full border border-white/70 dark:border-white/10" />
              <div className="absolute -top-7 -right-7 h-22 w-22 rounded-full border border-white/70 dark:border-white/10" />
              <div className={cn('absolute -bottom-10 -left-8 h-28 w-28 rounded-full blur-2xl', card.glowClassName)} />
            </div>

            <div className="relative flex items-center gap-3.5 sm:block">
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 ring-1 shadow-sm shadow-slate-900/5 dark:bg-white/10',
                  card.ringClassName,
                )}
              >
                <Icon className={cn('h-[19px] w-[19px]', card.iconClassName)} />
              </span>

              <div className="min-w-0 sm:mt-4">
                <p className="text-[15px] font-semibold text-slate-950 dark:text-white">{card.title}</p>
                <p className="mt-1 max-w-[24ch] text-xs leading-6 text-slate-500 dark:text-slate-400">{card.caption}</p>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}
