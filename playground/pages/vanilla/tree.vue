<template>
  <div>
    <h2>useDictTree — 树形字典 + 路径回溯</h2>
    <p style="color:#666;">支持任意深度树形数据，findPath 可求叶子节点的完整祖先路径</p>

    <div v-if="loading" style="padding:40px;text-align:center;color:#999;">加载中...</div>
    <div v-else>
      <div style="display:flex;gap:24px;">
        <div style="flex:1;">
          <h4>region 树形结构</h4>
          <div style="font-size:14px;line-height:1.8;">
            <template v-for="node in tree" :key="node.value">
              <div :style="{ marginLeft: '0' }">{{ node.label }} ({{ node.value }})</div>
              <template v-for="child in node.children" :key="child.value">
                <div :style="{ marginLeft: '16px' }">{{ child.label }} ({{ child.value }})</div>
                <template v-for="grandchild in child.children" :key="grandchild.value">
                  <div :style="{ marginLeft: '32px', color: '#666' }">{{ grandchild.label }} ({{ grandchild.value }})</div>
                </template>
              </template>
            </template>
          </div>
        </div>

        <div style="flex:1;">
          <h4>路径回溯 (findPath)</h4>
          <p style="font-size:14px;color:#666;">输入叶子编码，获取完整路径</p>
          <input v-model="lookupCode" placeholder="如 440104" style="padding:4px 8px;width:160px;" />
          <button @click="doLookup" style="margin-left:4px;cursor:pointer;">查询</button>
          <p v-if="lookupResult" style="margin-top:8px;font-size:18px;font-weight:bold;">
            {{ lookupResult.join(' → ') }}
          </p>
          <p v-else-if="lookupDone" style="margin-top:8px;color:#999;">未找到该编码</p>

          <div style="margin-top:24px;">
            <h4>常用查询</h4>
            <button v-for="c in examples" :key="c" @click="lookupCode = c; doLookup()" style="margin:2px;cursor:pointer;padding:2px 8px;">{{ c }}</button>
          </div>
        </div>
      </div>

      <details style="margin-top:16px;">
        <summary>树形数据 JSON</summary>
        <pre>{{ JSON.stringify(tree, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
const { tree, findPath, loading } = useDictTree('region')

const lookupCode = ref('')
const lookupResult = ref<string[] | null>(null)
const lookupDone = ref(false)
const examples = ['440104', '440304', '330108', '310115', '110101']

function doLookup() {
  lookupResult.value = findPath(lookupCode.value)
  lookupDone.value = true
}
</script>
