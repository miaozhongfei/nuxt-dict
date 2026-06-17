<template>
  <div>
    <h1>Element Plus 集成</h1>
    <p>
      演示 Element Plus 组件与 nuxt-dict 字典数据的结合使用。dict 数据格式
      <code>&#123; value, label, ... }</code> 与 Element Plus 的 options 格式天然兼容。
    </p>

    <!-- 1. el-select -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">el-select</span>
        <span style="color: #6b7280; font-size: 0.85rem">— gender 下拉选择</span>
      </div>
      <p class="demo-card__desc">
        将 <code>data</code> 直接作为 <code>&lt;el-option&gt;</code> 的 v-for 数据源。
      </p>

      <el-select v-model="gender" placeholder="请选择性别" style="width: 200px;">
        <el-option v-for="item in genderData" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <div class="demo-result" v-if="gender">
        选中：<b>{{ gender }}</b>
      </div>
    </div>

    <!-- 2. el-tag -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">el-tag</span>
        <span style="color: #6b7280; font-size: 0.85rem">— status 彩色标签</span>
      </div>
      <p class="demo-card__desc">
        字典项 <code>color</code> 扩展字段直接传给 <code>el-tag</code> 的 <code>:color</code> prop。
      </p>

      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <el-tag v-for="item in statusData" :key="item.value" :color="(item as any).color" effect="dark" size="large">
          {{ item.label }}
        </el-tag>
      </div>
    </div>

    <!-- 3. el-table -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">el-table</span>
        <span style="color: #6b7280; font-size: 0.85rem">— $dict.translate 表格翻译</span>
      </div>
      <p class="demo-card__desc">
        表格列中使用 <code>$dict.translate(type, val)</code> 同步翻译。
      </p>

      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column prop="name" label="姓名" width="80" />
        <el-table-column prop="gender" label="性别" width="100">
          <template #default="{ row }">
            {{ $dict.translate('gender', row.gender) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :color="$dict.translate('status', row.status, { field: 'color' })" effect="dark" size="small">
              {{ $dict.translate('status', row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="industry" label="行业" min-width="120" />
      </el-table>
    </div>

    <!-- 4. el-cascader -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">el-cascader</span>
        <span style="color: #6b7280; font-size: 0.85rem">— region 级联选择</span>
      </div>
      <p class="demo-card__desc">
        将 <code>TreeNode[]</code> 递归映射为 <code>el-cascader</code> 的 <code>:options</code> 格式。
      </p>

      <el-cascader v-model="regionValue" :options="cascaderOptions" placeholder="请选择地区" style="width: 320px;" />

      <div class="demo-result" v-if="regionValue.length">
        选中：<b>{{ regionValue.join(' / ') }}</b>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TreeNode } from '@lacqjs/nuxt-dict';

const { data: genderData } = useDict('gender');
const { data: statusData } = useDict('status');
const { tree } = useDictTree('region');

const { $dict } = useNuxtApp();

const gender = useState('demo-gender', () => '');
const regionValue = useState<string[]>('demo-region', () => []);

const tableData = [
  { name: '张三', gender: 'male', status: 1, industry: 'it' },
  { name: '李四', gender: 'female', status: 0, industry: 'finance' },
  { name: '王五', gender: 'male', status: 2, industry: 'edu' },
];

function toCascaderOptions(nodes: TreeNode[] | null): any[] {
  if (!nodes) return [];
  return nodes.map((n) => ({
    value: n.value,
    label: n.label,
    children: n.children ? toCascaderOptions(n.children) : undefined,
  }));
}

const cascaderOptions = computed(() => toCascaderOptions(tree.value));
</script>
