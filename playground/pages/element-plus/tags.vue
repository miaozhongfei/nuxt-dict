<template>
  <div>
    <h2>el-tag + 字典扩展字段（颜色）</h2>
    <p style="color:#666;">字典项的扩展字段（如 color）可直接用于组件属性</p>

    <div v-if="loading" style="padding:40px;text-align:center;color:#999;">加载中...</div>
    <div v-else>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
        <el-tag v-for="item in data" :key="item.value" :color="(item as any).color" effect="dark" size="large">
          {{ item.label }}
        </el-tag>
      </div>

      <br />
      <span>绑定到 el-select：</span>
      <el-select v-model="selected" placeholder="选择状态" style="width:160px;margin-left:8px;">
        <el-option v-for="o in data" :key="o.value" :label="o.label" :value="o.value" />
      </el-select>
      <span v-if="selected" style="margin-left:8px;">
        <el-tag :color="(data?.find(i => i.value === selected) as any)?.color" effect="dark">
          {{ data?.find(i => i.value === selected)?.label }}
        </el-tag>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, loading } = useDict('status')
const selected = ref<number>()
</script>
