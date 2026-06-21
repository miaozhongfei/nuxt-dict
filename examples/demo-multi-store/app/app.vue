<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* ===== 全局基础样式 ===== */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang SC',
    'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #1f2937;
  background: #f9fafb;
}

body {
  margin: 0;
  line-height: 1.6;
}

/* ===== 标题层级 ===== */
h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}

h2 {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

p {
  margin: 0 0 0.75rem;
  color: #4b5563;
}

/* ===== 链接 ===== */
a {
  color: #2563eb;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* ===== 行内代码 ===== */
:not(pre) > code {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 0.125rem 0.375rem;
  font-size: 0.9em;
  font-family:
    'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, 'Source Code Pro', monospace;
  color: #be185d;
}

/* ===== 容器 ===== */
.demo-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
}

/* ===== 卡片 ===== */
.demo-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.demo-card__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.demo-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  padding: 0.15rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace;
  white-space: nowrap;
}

.demo-card__desc {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

/* ===== 信息提示条 ===== */
.demo-tip {
  background: #fefce8;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  color: #92400e;
  margin-bottom: 1rem;
}

/* ===== 按钮 ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn--primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.btn--primary:hover {
  background: #1d4ed8;
}

/* ===== 输入框 / 下拉框 ===== */
.input,
select:not([class*='el-']):not([class*='van-']) {
  padding: 0.4rem 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #1f2937;
  background: #fff;
  outline: none;
  transition: border-color 0.15s;
}

.input:focus,
select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

/* ===== 结果输出 ===== */
.demo-result {
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #166534;
  font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace;
}

.demo-result--info {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1e40af;
}

/* ===== 加载 / 错误 ===== */
.demo-loading {
  color: #6b7280;
  font-style: italic;
  padding: 0.5rem 0;
}

.demo-error {
  color: #dc2626;
  padding: 0.5rem 0;
}

/* ===== 标签徽章 ===== */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* ===== 表格 ===== */
.demo-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.demo-table th,
.demo-table td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.demo-table th {
  background: #f3f4f6;
  font-weight: 600;
}

/* ===== 列表 ===== */
.demo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.demo-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.demo-list li:last-child {
  border-bottom: none;
}

/* ===== 颜色圆点 ===== */
.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  vertical-align: middle;
  flex-shrink: 0;
}

/* ===== 树形结构 ===== */
.tree-list {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0.25rem 1.5rem;
}

.tree-list li {
  padding: 0.2rem 0;
  font-size: 0.9rem;
}

/* ===== 首页卡片网格 ===== */
.home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.home-card {
  display: block;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.home-card:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  text-decoration: none;
}

.home-card h3 {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  color: #1f2937;
}

.home-card p {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

/* ===== 布局导航栏 ===== */
.layout-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 1.25rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.layout-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  height: 52px;
  overflow-x: auto;
}

.layout-nav__brand {
  font-weight: 700;
  font-size: 1rem;
  color: #1f2937;
  margin-right: 0.75rem;
  white-space: nowrap;
  font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace;
}

.layout-nav__link {
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #4b5563;
  white-space: nowrap;
  transition: all 0.15s;
  text-decoration: none;
}

.layout-nav__link:hover {
  background: #f3f4f6;
  color: #1f2937;
  text-decoration: none;
}

.layout-nav__link--active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

.layout-nav__lang {
  margin-left: auto;
  display: flex;
  gap: 0.35rem;
}

.layout-nav__lang-btn {
  padding: 0.25rem 0.55rem;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  font-size: 0.8rem;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.15s;
}

.layout-nav__lang-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  text-decoration: none;
}

.layout-nav__lang-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}
</style>
