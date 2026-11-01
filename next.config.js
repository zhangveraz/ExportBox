// 名称: Next.js 配置文件
// 描述: 定义Next.js框架的核心配置，包括图片域名白名单、严格模式等
// 路径: ExportBox/next.config.js
// 作者: ExportBox
// 更新时间: 2026-01-08

const isDevelopment = process.env.NODE_ENV !== 'production'
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://open.er-api.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 关闭开发模式下左下角的 Next.js 悬浮徽标
  devIndicators: false,
  // 优化图片
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // 生产环境优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  // 旧的「国际贸易术语」已合并进「外贸术语库」，老链接 301 过去，别让收藏的地址失效
  async redirects() {
    return [
      { source: '/tools/incoterms', destination: '/tools/glossary', permanent: true },
      { source: '/tools/incoterms/:path*', destination: '/tools/glossary', permanent: true },
    ]
  },
}

module.exports = nextConfig
