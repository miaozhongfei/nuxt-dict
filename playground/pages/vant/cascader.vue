<template>
  <div>
    <h2>van-cascader + useDictTree</h2>
    <p style="color:#666;">级联选择器，options 来自 useDictTree 数据转换</p>

    <ClientOnly>
      <div v-if="loading" style="padding:40px;text-align:center;color:#999;">加载中...</div>
      <div v-else style="max-width: 400px;">
        <van-field
          v-model="fieldValue"
          is-link
          readonly
          label="地区"
          placeholder="请选择地区"
          @click="showCascader = true"
        />
        <van-popup v-model:show="showCascader" round position="bottom">
          <van-cascader
            v-model="cascaderValue"
            title="请选择地区"
            :options="cascaderOptions"
            @close="showCascader = false"
            @finish="onFinish"
          />
        </van-popup>
        <p v-if="fieldValue" style="margin-top:12px;text-align:center;">
          已选择：<b>{{ fieldValue }}</b>
        </p>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { TreeNode } from '../../../../src/runtime/types'

const { tree, loading } = useDictTree('region')

function toVantCascader(nodes: TreeNode[] | null): any[] {
  if (!nodes) return []
  return nodes.map((n) => ({
    text: n.label,
    value: n.code,
    children: n.children?.length ? toVantCascader(n.children) : undefined,
  }))
}

const cascaderOptions = computed(() => toVantCascader(tree.value))
const cascaderValue = ref('')
const fieldValue = ref('')
const showCascader = ref(false)

function onFinish({ selectedOptions }: any) {
  showCascader.value = false
  fieldValue.value = selectedOptions.map((o: any) => o.text).join(' / ')
}
</script>
