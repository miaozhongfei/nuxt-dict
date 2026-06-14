<template>
  <div style="display: flex; min-height: 100vh; font-family: sans-serif; background: #f5f5f5;">
    <aside style="width: 240px; background: #fff; padding: 20px; border-right: 1px solid #e0e0e0;">
      <h3 style="margin-top:0; color: #409EFF;">@lacqjs/nuxt-dict</h3>

      <h4 style="margin-bottom: 8px; color: #666;">原生 HTML</h4>
      <nav style="display:flex;flex-direction:column;gap:2px;margin-bottom:20px;">
        <NuxtLink to="/vanilla/basic" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">useDict 基础翻译</NuxtLink>
        <NuxtLink to="/vanilla/options" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">useDict 选项</NuxtLink>
        <NuxtLink to="/vanilla/tree" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">useDictTree 树形</NuxtLink>
        <NuxtLink to="/vanilla/locale" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">useLocale 语言切换</NuxtLink>
        <NuxtLink to="/vanilla/multi-store" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">多存储库 Multi-Store</NuxtLink>
        <NuxtLink to="/vanilla/field-option" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">自定义字段 field</NuxtLink>
        <NuxtLink to="/vanilla/custom-adapter" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#E6A23C;">自定义 Adapter 调试</NuxtLink>
      </nav>

      <h4 style="margin-bottom: 8px; color: #666;">Element Plus</h4>
      <nav style="display:flex;flex-direction:column;gap:2px;margin-bottom:20px;">
        <NuxtLink to="/element-plus/select" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">el-select 下拉</NuxtLink>
        <NuxtLink to="/element-plus/tags" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">el-tag 状态标签</NuxtLink>
        <NuxtLink to="/element-plus/cascader" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">el-cascader 级联</NuxtLink>
        <NuxtLink to="/element-plus/table" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">el-table 表格</NuxtLink>
      </nav>

      <h4 style="margin-bottom: 8px; color: #666;">Vant (移动端)</h4>
      <nav style="display:flex;flex-direction:column;gap:2px;margin-bottom:20px;">
        <NuxtLink to="/vant/picker" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">van-picker 选择器</NuxtLink>
        <NuxtLink to="/vant/dropdown" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">van-dropdown 下拉</NuxtLink>
        <NuxtLink to="/vant/cascader" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#333;">van-cascader 级联</NuxtLink>
      </nav>

      <hr />
      <NuxtLink to="/about" style="padding:6px 12px;border-radius:4px;text-decoration:none;color:#888;font-size:14px;">关于模块</NuxtLink>
    </aside>

    <main style="flex:1; padding: 24px; overflow-x: auto;">
      <slot />
    </main>
  </div>
</template>
