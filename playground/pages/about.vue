<template>
  <div>
    <h1>关于 @lacqjs/nuxt-dict</h1>
    <table style="border-collapse:collapse; margin-top:16px;">
      <tbody>
      <tr><td style="padding:6px 12px;font-weight:bold;white-space:nowrap;">包名</td><td style="padding:6px 12px;">@lacqjs/nuxt-dict</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;">configKey</td><td style="padding:6px 12px;"><code>dict</code></td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;">类型</td><td style="padding:6px 12px;">Nuxt 4 Module</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;">缓存架构</td><td style="padding:6px 12px;">三层：IndexedDB → Memory LRU → shallowRef 渲染层</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;">数据模型</td><td style="padding:6px 12px;">扁平 DictItem + 树形 TreeNode（不限深度）</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;">API 适配</td><td style="padding:6px 12px;">适配器模式，内置默认 REST 适配器，可完全自定义</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:24px;">Runtime API</h3>
    <table style="border-collapse:collapse;">
      <thead><tr><th style="padding:6px 12px;text-align:left;">Composable</th><th style="padding:6px 12px;text-align:left;">说明</th></tr></thead>
      <tbody>
      <tr><td style="padding:6px 12px;"><code>useDict(type)</code></td><td style="padding:6px 12px;">响应式字典数据 + 翻译函数</td></tr>
      <tr><td style="padding:6px 12px;"><code>useDictOptions(type)</code></td><td style="padding:6px 12px;">生成 [{label, value}] 选项数组</td></tr>
      <tr><td style="padding:6px 12px;"><code>useDictTree(type)</code></td><td style="padding:6px 12px;">树形字典 + findPath 路径回溯</td></tr>
      <tr><td style="padding:6px 12px;"><code>useLocale()</code></td><td style="padding:6px 12px;">语言获取与切换</td></tr>
      <tr><td style="padding:6px 12px;"><code>$dict.translate(type, code)</code></td><td style="padding:6px 12px;">同步翻译（非响应式）</td></tr>
      <tr><td style="padding:6px 12px;"><code>$dict.translatePath(type, code)</code></td><td style="padding:6px 12px;">树形路径翻译</td></tr>
      </tbody>
    </table>
  </div>
</template>
