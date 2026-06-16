<template>
  <div>
    <h1>@lacqjs/nuxt-dict 功能演示</h1>
    <p style="color: #666; margin-bottom: 32px">
      企业级 Nuxt 4 国际化字典模块，支持三层缓存（IndexedDB → Memory → 渲染层）、
      扁平/树形字典、语言切换、element-plus / vant 集成。
    </p>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px">
      <!-- 原生 HTML -->
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #fff">
        <h3
          style="
            margin-top: 0;
            border-bottom: 2px solid #67c23a;
            padding-bottom: 8px;
            color: #67c23a;
          "
        >
          原生 HTML
        </h3>
        <p style="color: #666; font-size: 14px">
          零第三方 UI 依赖，纯 useDict / useDictTree / useLocale
        </p>
        <NuxtLink to="/vanilla/basic" style="display: block; margin-top: 12px; color: #409eff"
          >→ 基础翻译</NuxtLink
        >
        <NuxtLink to="/vanilla/options" style="display: block; color: #409eff">→ 选项生成</NuxtLink>
        <NuxtLink to="/vanilla/tree" style="display: block; color: #409eff">→ 树形字典</NuxtLink>
        <NuxtLink to="/vanilla/locale" style="display: block; color: #409eff">→ 语言切换</NuxtLink>
      </div>

      <!-- Element Plus -->
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #fff">
        <h3
          style="
            margin-top: 0;
            border-bottom: 2px solid #409eff;
            padding-bottom: 8px;
            color: #409eff;
          "
        >
          Element Plus
        </h3>
        <p style="color: #666; font-size: 14px">
          el-select / el-tag / el-cascader / el-table + 字典数据绑定
        </p>
        <NuxtLink to="/element-plus/select" style="display: block; margin-top: 12px; color: #409eff"
          >→ el-select</NuxtLink
        >
        <NuxtLink to="/element-plus/tags" style="display: block; color: #409eff"
          >→ el-tag 状态</NuxtLink
        >
        <NuxtLink to="/element-plus/cascader" style="display: block; color: #409eff"
          >→ el-cascader 级联</NuxtLink
        >
        <NuxtLink to="/element-plus/table" style="display: block; color: #409eff"
          >→ el-table 表格</NuxtLink
        >
      </div>

      <!-- Vant -->
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #fff">
        <h3
          style="
            margin-top: 0;
            border-bottom: 2px solid #e040fb;
            padding-bottom: 8px;
            color: #e040fb;
          "
        >
          Vant
        </h3>
        <p style="color: #666; font-size: 14px">
          van-picker / van-dropdown / van-cascader 移动端适配
        </p>
        <NuxtLink to="/vant/picker" style="display: block; margin-top: 12px; color: #409eff"
          >→ van-picker</NuxtLink
        >
        <NuxtLink to="/vant/dropdown" style="display: block; color: #409eff"
          >→ van-dropdown</NuxtLink
        >
        <NuxtLink to="/vant/cascader" style="display: block; color: #409eff"
          >→ van-cascader</NuxtLink
        >
      </div>
    </div>
  </div>
</template>
