/**
 * 真实浏览器冒烟测试：在 Chromium 里打开几个关键页面，
 * 检查 1) HTTP 200 2) 控制台没有报错 3) 关键文案渲染出来。
 *
 * 需要先启动服务（CI 里用 npm start，本地可以用 npm run dev）：
 *   BASE_URL=http://localhost:3000 node scripts/verify-web.cjs
 */
const { chromium } = require('playwright')

const BASE = process.env.BASE_URL || 'http://localhost:3000'

const PAGES = [
  { path: '/', expect: 'ExportBox' },
  { path: '/tools', expect: '工具' },
  { path: '/tools/glossary', expect: '外贸术语库' },
  { path: '/tools/invoice-generator', expect: '发票' },
  { path: '/tools/barcode-generator', expect: '条码' },
  { path: '/tools/inquiry-priority-scorer', expect: '询盘' },
]

let passed = 0
const failures = []

function check(condition, message) {
  if (condition) {
    passed += 1
    return
  }
  failures.push(message)
}

/** 本机没装 Chromium 内核时，退回系统自带的 Edge / Chrome，方便本地跑。 */
async function launchBrowser() {
  const attempts = [{}, { channel: 'msedge' }, { channel: 'chrome' }]
  let lastError
  for (const options of attempts) {
    try {
      return await chromium.launch({ ...options, args: ['--no-sandbox'] })
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

async function main() {
  const browser = await launchBrowser()
  const context = await browser.newContext()
  const page = await context.newPage()

  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const text = msg.text()
    if (text.includes('favicon')) return
    consoleErrors.push(text)
  })
  page.on('pageerror', (error) => consoleErrors.push(String(error)))

  for (const item of PAGES) {
    consoleErrors.length = 0
    const response = await page.goto(BASE + item.path, { waitUntil: 'networkidle', timeout: 30000 })
    check(response !== null && response.status() === 200, item.path + ' 返回状态码 ' + (response ? response.status() : 'null'))
    const body = await page.textContent('body')
    check(Boolean(body && body.includes(item.expect)), item.path + ' 缺少关键文案：' + item.expect)
    check(consoleErrors.length === 0, item.path + ' 控制台报错：' + consoleErrors.slice(0, 3).join(' | '))
  }

  await context.close()
  await browser.close()

  console.log('真实浏览器检查通过 ' + passed + ' 条断言')
  if (failures.length > 0) {
    console.error('失败 ' + failures.length + ' 条：')
    for (const failure of failures) console.error('  - ' + failure)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('真实浏览器检查异常：', error)
  process.exit(1)
})
