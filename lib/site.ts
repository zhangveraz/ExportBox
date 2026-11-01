// 名称: 站点基础配置
// 描述: 集中维护站点域名与品牌名，供 metadata、sitemap、robots 等复用
// 路径: ExportBox/lib/site.ts
// 作者: ExportBox
// 更新时间: 2026-10-30

export const SITE_NAME = 'ExportBox'
// TODO: 上线前把这里换成你自己的真实域名，否则 canonical / sitemap 会指向错误地址
export const SITE_URL = 'https://exportbox.example.com'
