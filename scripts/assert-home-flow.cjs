const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { loadTypescriptModule } = require('./load-typescript-module.cjs')

const root = path.join(__dirname, '..')
const { TOOL_REGISTRY } = loadTypescriptModule('lib/tools/registry.ts')
const { HOME_FLOW_STAGES, HOME_FLOW_TOOL_SLUGS } = loadTypescriptModule('components/home/home-flow.ts')

let assertionCount = 0
const equal = (actual, expected, message) => {
  assertionCount += 1
  assert.equal(actual, expected, message)
}
const ok = (value, message) => {
  assertionCount += 1
  assert.ok(value, message)
}

// 1) 首页业务流固定 6 段，顺序即生意顺序
const labels = HOME_FLOW_STAGES.map((stage) => stage.label)
equal(labels.join('|'), '询盘与沟通|报价与核算|收款与风险|出货与物流|单证与交期|效率小工具', '首页业务流阶段与顺序固定')

// 2) 引用的 slug 必须真实存在
const registrySlugs = TOOL_REGISTRY.map((tool) => tool.slug)
const unknown = HOME_FLOW_TOOL_SLUGS.filter((slug) => !registrySlugs.includes(slug))
equal(unknown.length, 0, '首页业务流引用了不存在的工具：' + unknown.join(', '))

// 3) 一个工具只能出现在一个阶段
const duplicates = HOME_FLOW_TOOL_SLUGS.filter((slug, index, list) => list.indexOf(slug) !== index)
equal(duplicates.length, 0, '同一个工具被放进多个阶段：' + Array.from(new Set(duplicates)).join(', '))

// 4) 每个工具都必须出现在首页业务流里，总数对齐
const missing = registrySlugs.filter((slug) => !HOME_FLOW_TOOL_SLUGS.includes(slug))
equal(missing.length, 0, '有工具没有归入首页业务流：' + missing.join(', '))
equal(HOME_FLOW_TOOL_SLUGS.length, TOOL_REGISTRY.length, '首页业务流覆盖的工具总数与注册表一致')

// 5) 每个阶段至少 3 个工具，且都有说明文案
const thinStages = HOME_FLOW_STAGES.filter((stage) => stage.slugs.length < 3).map((stage) => stage.label)
equal(thinStages.length, 0, '阶段工具过少：' + thinStages.join(', '))
const emptySummaries = HOME_FLOW_STAGES.filter((stage) => !stage.summary || stage.summary.length < 8).map((stage) => stage.label)
equal(emptySummaries.length, 0, '阶段缺少说明文案：' + emptySummaries.join(', '))

// 6) 几处归属由产品拍板，写成断言防止以后被改回去
const stageOf = (slug) => (HOME_FLOW_STAGES.find((stage) => stage.slugs.includes(slug)) || {}).label
equal(stageOf('export-tax-rebate-calculator'), '收款与风险', '出口退税归入收款与风险')
equal(stageOf('rmb-converter'), '效率小工具', '人民币大写归入效率小工具')
equal(stageOf('number-to-english'), '效率小工具', '数字转英文归入效率小工具')
equal(stageOf('currency-symbols'), '效率小工具', '货币符号大全归入效率小工具')
equal(stageOf('quote-calculator'), '报价与核算', '报价利润计算器归入报价与核算')
equal(stageOf('invoice-generator'), '单证与交期', '发票生成器归入单证与交期')

// 7) 首页不再按功能分类渲染，也不再挂右侧悬浮条（分类标签已挪到工具页底部）
const directorySource = fs.readFileSync(path.join(root, 'components/home/home-tool-directory.tsx'), 'utf8')
ok(!directorySource.includes('HOME_TOOLS_BY_CATEGORY'), '首页工具目录不再使用功能分类数据')
const homePageSource = fs.readFileSync(path.join(root, 'app/page.tsx'), 'utf8')
ok(!homePageSource.includes('HomeCategoryRail'), '首页不再渲染右侧悬浮分类条')

// 8) 工具页底部必须挂上功能分类标签条
const toolsLayoutSource = fs.readFileSync(path.join(root, 'app/tools/layout.tsx'), 'utf8')
ok(toolsLayoutSource.includes('ToolCategoryNav'), '工具页底部渲染功能分类标签条')
const toolsPageSource = fs.readFileSync(path.join(root, 'app/tools/page.tsx'), 'utf8')
ok(toolsPageSource.includes('功能性分类'), '全部工具目录页说明自己是按功能性分类')

console.log(`首页业务流校验通过（${assertionCount} 条断言，${HOME_FLOW_STAGES.length} 阶段 / ${HOME_FLOW_TOOL_SLUGS.length} 个工具）`)
