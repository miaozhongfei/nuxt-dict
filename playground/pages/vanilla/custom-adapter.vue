<template>
  <div>
    <h2>自定义 Adapter 调试 — storeName 参数</h2>

    <div style="background:#2d2d2d;color:#f8f8f2;padding:16px;border-radius:8px;font-family:monospace;font-size:13px;line-height:1.6;margin-bottom:20px;">
      <div style="color:#f92672;">// DictAdapter 新签名 ↓</div>
      <div style="color:#66d9ef;">export</div> <div style="color:#66d9ef;">interface</div> <div style="color:#a6e22e;">DictAdapter</div> {
      <div>&nbsp;&nbsp;<span style="color:#e6db74;">fetchDict</span>(<span style="color:#fd971f;">storeName</span>: <span style="color:#66d9ef;">string</span>, options: { types: <span style="color:#66d9ef;">string</span>[]; locale: <span style="color:#66d9ef;">string</span> }): <span style="color:#66d9ef;">Promise</span>&lt;<span style="color:#a6e22e;">DictResponse</span>&gt;</div>
      <div>&nbsp;&nbsp;<span style="color:#e6db74;">fetchVersion</span>(<span style="color:#fd971f;">storeName</span>: <span style="color:#66d9ef;">string</span>): <span style="color:#66d9ef;">Promise</span>&lt;<span style="color:#66d9ef;">string</span>&gt;</div>
      <div>}</div>
    </div>

    <p style="color:#666;">
      此页面验证<strong>多数据源配置</strong>：<code>dicts</code>（默认仓库）调用
      <code>/api/dict/list</code>；<code>dicts2</code>（配置了 <code>dictEndpoint: '/api/dict/list2'</code>）调用不同端点。
      打开 <strong>DevTools Network 面板</strong> 可看到两个不同的请求。
    </p>

    <div v-if="loading" style="padding:40px;text-align:center;color:#999;">加载中...</div>

    <template v-else>
      <h3>默认仓库 <code>'dicts'</code> — 全局 api 配置</h3>
      <p style="color:#666;">端点: <code>/api/dict/list</code> | adapter.storeName = <code>'dicts'</code></p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
        <thead><tr><th>code</th><th>useDict 翻译</th><th>$dict.translate</th></tr></thead>
        <tbody>
          <tr v-for="item in defaultData" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ defaultTranslate(item.value) }}</td>
            <td>{{ $dict.translate('gender', item.value) }}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top:12px;">
        <button @click="doDefaultRefresh" style="cursor:pointer;">刷新 — 查看 Network 面板</button>
        <span style="margin-left:8px;color:#666;">data 长度: {{ defaultData?.length }}</span>
      </div>

      <hr style="margin:24px 0;" />

      <h3>仓库 <code>'dicts2'</code> — stores.dicts2.dictEndpoint = '/api/dict/list2'</h3>
      <p style="color:#666;">端点: <code>/api/dict/list2</code> | adapter.storeName = <code>'dicts2'</code></p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
        <thead><tr><th>code</th><th>useDict 翻译</th><th>$dict.translate</th></tr></thead>
        <tbody>
          <tr v-for="item in store2Data" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ store2Translate(item.value) }}</td>
            <td>{{ $dict.translate('gender', item.value, { storeName: 'dicts2' }) }}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top:12px;">
        <button @click="doStore2Refresh" style="cursor:pointer;">刷新 — 查看 /api/dict/list2 请求</button>
        <span style="margin-left:8px;color:#666;">data 长度: {{ store2Data?.length }}</span>
      </div>

      <hr style="margin:24px 0;" />

      <div style="background:#fff3cd;border:1px solid #ffc107;padding:12px;border-radius:4px;">
        <strong style="color:#856404;">验证要点：</strong>
        <ol style="margin:8px 0 0 16px;color:#666;">
          <li>打开 <strong>F12 → Network</strong> 面板</li>
          <li>分别点击两个"刷新"按钮</li>
          <li>观察两个不同的请求：<code>/api/dict/list</code> 和 <code>/api/dict/list2</code></li>
          <li>dicts2 的数据带 <strong>【源2】</strong> 前缀，与 dicts 的数据不同</li>
        </ol>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const {
  data: defaultData,
  translate: defaultTranslate,
  loading: defaultLoading,
  refresh: defaultRefresh,
} = useDict('gender')

const {
  data: store2Data,
  translate: store2Translate,
  loading: store2Loading,
  refresh: store2Refresh,
} = useDict('dicts2', 'gender')

const loading = computed(() =>
  defaultLoading.value || store2Loading.value,
)

function doDefaultRefresh() {
  defaultRefresh()
}
function doStore2Refresh() {
  store2Refresh()
}
const { $dict } = useNuxtApp()
const a = $dict.translate('gender', '1')
const b = $dict.translate('gender', '1', { storeName: 'dicts2' })
const c = $dict.translate('gender', '1' , { storeName: 'dicts', field: 'name' })
</script>
