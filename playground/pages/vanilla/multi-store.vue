<template>
  <div>
    <h2>多存储库 Multi-Store</h2>
    <p style="color:#666;">同一字典类型可从不同的 IndexedDB 对象存储库加载，实现数据隔离。</p>

    <div v-if="loading" style="padding:40px;text-align:center;color:#999;">加载中...</div>

    <template v-else>
      <h3>默认存储库 <code>'dicts'</code> — gender</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
        <thead><tr><th>code</th><th>label（useDict 翻译）</th><th>$dict.translate</th></tr></thead>
        <tbody>
          <tr v-for="item in defaultData" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ defaultTranslate(item.code) }}</td>
            <td>{{ $dict.translate('gender', item.code) }}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:12px;">
        <button @click="doDefaultRefresh" style="cursor:pointer;">刷新</button>
        <span style="margin-left:8px;color:#666;">data 长度: {{ defaultData?.length }}</span>
      </div>

      <hr style="margin:24px 0;" />

      <h3>自定义存储库 <code>'dicts2'</code> — gender（useDict 双参形式）</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
        <thead><tr><th>code</th><th>label（useDict 翻译）</th><th>$dict.translate（3 参）</th></tr></thead>
        <tbody>
          <tr v-for="item in store2Data" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ store2Translate(item.code) }}</td>
            <td>{{ $dict.translate('dicts2', 'gender', item.code) }}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:12px;">
        <button @click="doStore2Refresh" style="cursor:pointer;">刷新</button>
        <span style="margin-left:8px;color:#666;">data 长度: {{ store2Data?.length }}</span>
      </div>

      <hr style="margin:24px 0;" />

      <h3>自定义存储库 <code>'dicts3'</code> — useDictOptions + useDictTree</h3>

      <div style="display:flex;gap:40px;">
        <div>
          <h4>useDictOptions('dicts3', 'status')</h4>
          <div v-if="store3OptionsLoading">加载中...</div>
          <ul v-else>
            <li v-for="opt in store3Options" :key="opt.value">
              {{ opt.label }} ({{ opt.value }})
            </li>
          </ul>
        </div>

        <div>
          <h4>useDictTree('dicts3', 'region')</h4>
          <div v-if="store3TreeLoading">加载中...</div>
          <ul v-else>
            <li v-for="node in store3Tree" :key="node.code">
              {{ node.label }} ({{ node.code }})
              <span v-if="node.children" style="color:#999;">
                — {{ node.children.length }} 个子节点
              </span>
            </li>
          </ul>
        </div>
      </div>

      <hr style="margin:24px 0;" />

      <h3>自定义存储库 <code>'payment'</code> — 自定义 Adapter（不走 HTTP）</h3>
      <p style="color:#666;">该仓库在 nuxt.config.ts 中通过 <code>stores.payment.adapter</code> 配置了自定义适配器，数据直接由函数返回，不发起网络请求。</p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
        <thead><tr><th>code</th><th>label（useDict 翻译）</th><th>$dict.translate</th></tr></thead>
        <tbody>
          <tr v-for="item in paymentData" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ paymentTranslate(item.code) }}</td>
            <td>{{ $dict.translate('payment', 'status', item.code) }}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top:12px;">
        <button @click="doPaymentRefresh" style="cursor:pointer;">刷新</button>
        <span style="margin-left:8px;color:#666;">data 长度: {{ paymentData?.length }}</span>
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
} = useDict('gender')

// 自定义存储库 'dicts2' —— 双参形式
const {
  data: store2Data,
  translate: store2Translate,
  loading: store2Loading,
} = useDict('dicts2', 'gender')

// 自定义存储库 'dicts3' —— useDictOptions + useDictTree
const {
  options: store3Options,
  loading: store3OptionsLoading,
} = useDictOptions('dicts3', 'status')

const {
  tree: store3Tree,
  loading: store3TreeLoading,
} = useDictTree('dicts3', 'region')

// 自定义存储库 'payment' —— 通过 stores.payment.adapter 使用自定义适配器
const {
  data: paymentData,
  translate: paymentTranslate,
  loading: paymentLoading,
  refresh: paymentRefresh,
} = useDict('payment', 'status')

const loading = computed(() =>
  defaultLoading.value || store2Loading.value,
)

function doDefaultRefresh() {
  useDict('gender').refresh()
}
function doStore2Refresh() {
  useDict('dicts2', 'gender').refresh()
}
function doPaymentRefresh() {
  paymentRefresh()
}
</script>
