// 名称: 外贸资源精选
// 描述: 管理可在首页与资源页展示的外贸相关资源推荐
// 路径: ExportBox/lib/partner-resources.ts
// 作者: ExportBox
// 更新时间: 2026-10-30

export type PartnerResourceType =
  | '客户开发'
  | '代理网络'
  | '浏览器环境'
  | '企业数据'
  | '主机与建站'
  | '域名服务'
  | '账号与支付'
  | 'AI 工具'
  | '验证服务'

export interface PartnerResource {
  id: string
  name: string
  type: PartnerResourceType
  href: string
  description: string
  bestFor: string[]
  badge?: string
}

/**
 * 资源推荐位。
 *
 * 原项目内置了一批外部推广链接，已全部移除。
 * 如需展示自己的推荐资源，按 PartnerResource 结构往数组里加即可，
 * 首页与资源页会自动渲染；数组为空时，相关区块会自动隐藏或不展示内容。
 */
export const PARTNER_RESOURCES: PartnerResource[] = []
