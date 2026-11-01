// 名称: 页头组件
// 描述: 网站顶部容器，集成Logo与导航栏，支持粘性定位和毛玻璃效果
// 路径: ExportBox/components/layout/header.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from './navigation'

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-white/70 bg-white/80 shadow-xs shadow-slate-900/3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75 dark:shadow-black/20">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-95">
          {/* 浅色模式使用深色字标，深色模式切换为高对比度的亮色字标 */}
          <Image
            src="/logo.svg"
            alt="ExportBox Logo"
            width={168}
            height={48}
            priority
            className="h-10 w-auto shrink-0 object-contain dark:hidden"
            style={{ width: 'auto', height: '40px' }}
          />
          <Image
            src="/logo-dark.svg"
            alt="ExportBox Logo"
            width={168}
            height={48}
            priority
            className="hidden h-10 w-auto shrink-0 object-contain dark:block"
            style={{ width: 'auto', height: '40px' }}
          />
          <span className="hidden rounded-md border border-emerald-200/80 bg-emerald-50/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200 xl:inline-flex">
            Trade Desk
          </span>
        </Link>

        <Navigation />
      </div>
    </header>
  )
}
