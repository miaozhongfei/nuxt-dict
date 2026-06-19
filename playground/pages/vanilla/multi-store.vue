<template>
  <div>
    <h2>多存储库 Multi-Store</h2>
    <p style="color: #666">同一字典类型可从不同的 IndexedDB 对象存储库加载，实现数据隔离。</p>

    <div v-if="loading" style="padding: 40px; text-align: center; color: #999">加载中...</div>

    <template v-else>
      <h3>默认存储库 <code>'dicts'</code> — gender</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse">
        <thead>
          <tr>
            <th>value</th>
            <th>label（useDict 翻译）</th>
            <th>$dict.translate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in defaultData" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ defaultTranslate(item.value) }}</td>
            <td>{{ $dict.translate('gender', item.value) }}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 12px">
        <button @click="doDefaultRefresh" style="cursor: pointer">刷新</button>
        <span style="margin-left: 8px; color: #666">data 长度: {{ defaultData?.length }}</span>
      </div>

      <hr style="margin: 24px 0" />

      <h3>自定义存储库 <code>'dicts2'</code> — gender（useDict 双参形式）</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse">
        <thead>
          <tr>
            <th>code</th>
            <th>label（useDict 翻译）</th>
            <th>$dict.translate（opts.storeName）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store2Data" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ store2Translate(item.value) }}</td>
            <td>{{ $dict.translate('gender', item.value, { storeName: 'dicts2' }) }}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 12px">
        <button @click="doStore2Refresh" style="cursor: pointer">刷新</button>
        <span style="margin-left: 8px; color: #666">data 长度: {{ store2Data?.length }}</span>
      </div>

      <hr style="margin: 24px 0" />

      <h3>自定义存储库 <code>'dicts3'</code> — useDict + useDictTree</h3>

      <div style="display: flex; gap: 40px">
        <div>
          <h4>useDict('dicts3', 'status')</h4>
          <div v-if="store3OptionsLoading">加载中...</div>
          <ul v-else>
            <li v-for="opt in store3Data" :key="opt.value">{{ opt.label }} ({{ opt.value }})</li>
          </ul>
        </div>

        <div>
          <h4>useDictTree('dicts3', 'region')</h4>
          <div v-if="store3TreeLoading">加载中...</div>
          <ul v-else>
            <li v-for="node in store3Tree" :key="node.value">
              {{ node.label }} ({{ node.value }})
              <span v-if="node.children" style="color: #999">
                — {{ node.children.length }} 个子节点
              </span>
            </li>
          </ul>
        </div>
      </div>

      <hr style="margin: 24px 0" />

      <h3>自定义存储库 <code>'payment'</code> — 自定义 Adapter（文件路径方式）</h3>
      <p style="color: #666">
        该仓库通过约定路径 <code>~/dict/payment-adapter.ts</code> 或 nuxt.config.ts 中
        <code>stores.payment.adapter</code> 指定适配器文件路径，模块构建时通过 virtual module
        注入。
      </p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse">
        <thead>
          <tr>
            <th>value</th>
            <th>label（useDict 翻译）</th>
            <th>$dict.translate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paymentData" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ paymentTranslate(item.value) }}</td>
            <td>{{ $dict.translate('status', item.value, { storeName: 'payment' }) }}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top: 12px">
        <button @click="doPaymentRefresh" style="cursor: pointer">刷新</button>
        <span style="margin-left: 8px; color: #666">data 长度: {{ paymentData?.length }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// 默认存储库 'dicts' —— 单参形式
const {
  data: defaultData,
  translate: defaultTranslate,
  loading: defaultLoading,
} = useDict('gender');

// 自定义存储库 'dicts2' —— 双参形式
const {
  data: store2Data,
  translate: store2Translate,
  loading: store2Loading,
} = useDict('dicts2', 'gender');

// 自定义存储库 'dicts3' —— useDict + useDictTree
const { data: store3Data, loading: store3OptionsLoading } = useDict('dicts3', 'status');

const { tree: store3Tree, loading: store3TreeLoading } = useDictTree('dicts3', 'region');

// 自定义存储库 'payment' —— 通过 ~/dict/payment-adapter.ts 约定路径或显式配置 adapter 文件路径
const {
  data: paymentData,
  translate: paymentTranslate,
  loading: paymentLoading,
  refresh: paymentRefresh,
} = useDict('payment', 'status');

const loading = computed(() => defaultLoading.value || store2Loading.value);

function doDefaultRefresh() {
  useDict('gender').refresh();
}
function doStore2Refresh() {
  useDict('dicts2', 'gender').refresh();
}
function doPaymentRefresh() {
  paymentRefresh();
}
</script>
