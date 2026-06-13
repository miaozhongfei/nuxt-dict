<template>
  <div>
    <h2>el-table + $dict.translate 格式化</h2>
    <p style="color:#666;">表格列用 $dict.translate() 做编码→文本的 formatter</p>

    <div v-if="loading" style="padding:40px;text-align:center;color:#999;">加载中...</div>
    <el-table v-else :data="tableData" border style="width:100%;">
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="gender" label="性别" width="100">
        <template #default="{ row }">
          {{ $dict.translate('gender', row.gender) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :color="statusColor(row.status)" effect="dark" size="small">
            {{ $dict.translate('status', row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="industry" label="行业" width="120">
        <template #default="{ row }">
          {{ $dict.translate('industry', row.industry) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
const { data: statusData, loading } = useDict('status')

// Pre-load all dicts needed for table
useDict('gender')
useDict('industry')

function statusColor(code: number) {
  return (statusData.value?.find((i: any) => i.code === code) as any)?.color
}

const tableData = [
  { name: '张三', gender: 'male', status: 1, industry: 'it' },
  { name: '李四', gender: 'female', status: 2, industry: 'edu' },
  { name: '王五', gender: 'male', status: 0, industry: 'finance' },
  { name: '赵六', gender: 'other', status: 3, industry: 'health' },
  { name: '钱七', gender: 'female', status: 1, industry: 'manufacture' },
]
</script>
