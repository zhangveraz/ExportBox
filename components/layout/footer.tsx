// 名称: 页脚组件
// 描述: 网站底部区域，展示版权信息、站内导航及技术栈说明
// 路径: ExportBox/components/layout/footer.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import Image from 'next/image'
import Link from 'next/link'
import { SITE_NAME } from '@/lib/site'

const NAV_LINKS = [
  { href: '/tools', label: '工具目录' },
  { href: '/faq', label: '常见问题' },
  { href: '/about', label: '关于' },
  { href: '/privacy', label: '隐私政策' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 mt-auto border-t border-white/70 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-center md:text-left">
            <Image
              src="/brand/vera-logo.jpg"
              alt="Vera 个人标识"
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/15"
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                © {currentYear} {SITE_NAME}. 由 Vera 维护
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Built for global trade teams · Curated by Vera
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm md:justify-end">
            {NAV_LINKS.map((item, index) => (
              <span key={item.href} className="flex items-center gap-4">
                {index > 0 && <span className="hidden text-slate-300 dark:text-white/20 sm:inline">|</span>}
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 text-slate-500 transition-colors hover:text-blue-700 dark:text-slate-400 dark:hover:text-cyan-200"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/80 pt-8 dark:border-white/10">
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            基于{' '}
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors hover:text-blue-700 dark:hover:text-cyan-200"
            >
              Next.js
            </Link>{' '}
            构建 · 由 Vera 维护
          </p>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
            本项目基于 GloboKit 修改，遵循 GPL-3.0-only 许可发布，原项目版权归原作者所有。
          </p>
        </div>
      </div>
    </footer>
  )
}
