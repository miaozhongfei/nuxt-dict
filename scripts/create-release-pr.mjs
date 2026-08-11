import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

/**
 * @description 创建 dev → main 发版 PR，含多种意外场景处理
 * @example node scripts/create-release-pr.mjs
 */

const log = (msg) => console.log(`\x1b[36m[release-pr]\x1b[0m ${msg}`)
const warn = (msg) => console.warn(`\x1b[33m[release-pr]\x1b[0m ${msg}`)
const fail = (msg) => { console.error(`\x1b[31m[release-pr]\x1b[0m ${msg}`); process.exit(1) }

function run(cmd, silent = false) {
  try {
    const result = execSync(cmd, { stdio: silent ? 'pipe' : 'inherit', encoding: 'utf-8' })
    return silent ? (result || '').trim() : true
  } catch {
    return null
  }
}

// 1. 检查 gh 是否安装
log('检查 gh 是否已安装...')
if (run('gh --version', true) === null) {
  fail('未检测到 GitHub CLI，请安装：winget install GitHub.cli')
}

// 2. 检查 gh 是否已登录
log('检查 gh 认证状态...')
const authStatus = run('gh auth status', true)
if (!authStatus || authStatus.includes('not logged')) {
  fail('GitHub CLI 未登录，请执行：gh auth login')
}

// 3. 检查是否已有同名 PR
log('检查是否已有 dev→main PR...')
const existingPrs = run('gh pr list --base main --head dev --state open --json number,title,url --jq ".[] | \\\"#\\\\(.number) \\\\(.title)\\\""', true)
if (existingPrs) {
  warn(`已存在 dev→main PR: ${existingPrs.replace(/\n/g, ', ')}`)
  warn('请手动关闭旧 PR 后重试，或直接使用已存在的 PR')
  process.exit(1)
}

// 4. 读取版本号
let version
try {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'))
  version = pkg.version
  log(`当前版本: v${version}`)
} catch (err) {
  fail(`无法读取 package.json: ${err.message}`)
}

// 5. 创建 PR
log('创建 PR...')
let created = false

// 优先 --fill-first（首 commit 信息作标题）
log('尝试 --fill-first...')
if (run('gh pr create --base main --head dev --fill-first') !== null) {
  created = true
}

// --fill-first 失败 → 回退为版本号标题
if (!created) {
  warn('--fill-first 失败，回退为版本号标题')
  const title = `chore(release): v${version}`
  const body = `Release v${version}. See CHANGELOG.md.`
  if (run(`gh pr create --base main --head dev --title "${title}" --body "${body}"`) !== null) {
    created = true
  }
}

// 版本号标题也失败 → 打开浏览器手动创建
if (!created) {
  warn('自动创建失败，打开浏览器手动创建...')
  run('gh pr create --base main --head dev --web')
  created = true
}

log('PR 创建完成')
