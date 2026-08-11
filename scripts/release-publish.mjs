import { execSync } from 'node:child_process'

/**
 * @description 在 main 分支上发布 npm 包 + 创建 GitHub Release，含多种意外场景处理
 * @example node scripts/release-publish.mjs
 */

const log = (msg) => console.log(`\x1b[36m[publish]\x1b[0m ${msg}`)
const warn = (msg) => console.warn(`\x1b[33m[publish]\x1b[0m ${msg}`)
const fail = (msg) => { console.error(`\x1b[31m[publish]\x1b[0m ${msg}`); process.exit(1) }

let panic = false

function run(cmd, silent = false) {
  try {
    const result = execSync(cmd, { stdio: silent ? 'pipe' : 'inherit', encoding: 'utf-8', shell: true })
    return silent ? (result || '').trim() : true
  } catch (err) {
    if (silent) return null
    warn(`命令失败: ${cmd}`)
    warn(err.stderr || err.message)
    panic = true
    return null
  }
}

function mustRun(cmd, errorMsg) {
  const result = run(cmd)
  if (panic) fail(errorMsg)
  return result
}

// 1. 检查本地是否有未提交变更
log('检查本地工作区状态...')
const status = run('git status --porcelain', true)
if (status) {
  fail(`存在未提交的变更，请先处理:\n${status}`)
}

// 2. 检查 PR 是否已合并到 main
log('检查 PR 是否已合并到 main...')
run('git fetch origin main', true)
try {
  execSync('git merge-base --is-ancestor dev origin/main', { stdio: 'pipe', encoding: 'utf-8' })
} catch {
  fail('PR 尚未合并到 main，请先在 GitHub 上合并 dev→main 的 PR')
}

// 3. 切换到 main 分支
log('切换到 main 分支...')
// -f 强制切换，忽略 untracked 文件冲突
run('git checkout -f main')
run('git fetch origin main')
run('git reset --hard origin/main')
if (panic) fail('切换到 main 分支失败')

// 4. 发布到 npm
log('发布到 npm...')
mustRun('pnpm publish', 'npm 发布失败')

// 5. 创建 GitHub Release
log('创建 GitHub Release...')
const releaseResult = run('pnpm exec changelogen gh release', true)
if (panic || !releaseResult) {
  warn('GitHub Release 创建失败或需要手动确认')
  warn('请手动创建 Release: https://github.com/miaozhongfei/nuxt-dict/releases')
}

// 6. 切回 dev
log('切回 dev 分支...')
run('git checkout dev')
if (panic) {
  warn('切回 dev 失败，请手动执行: git checkout dev')
}

if (!panic) {
  log('发布完成')
}
