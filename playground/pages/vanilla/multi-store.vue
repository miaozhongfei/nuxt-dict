<template>
  <div>
    <h2>多存储库 Multi-Store — lazy 版本检查测试</h2>
    <p style="color: #666">
      5 个仓库覆盖 REST/自定义适配器 × lazy on/off 全部组合。打开 DevTools → Network
      面板观察版本检查和字典请求的时机。
    </p>

    <div style="margin: 8px 0 16px; display: flex; align-items: center; gap: 8px">
      <span style="color: #666">语言切换：</span>
      <button
        style="padding: 4px 14px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px"
        :style="{
          background: currentLocale === 'zh-CN' ? '#409EFF' : '#fff',
          color: currentLocale === 'zh-CN' ? '#fff' : '#333',
        }"
        @click="switchLocale('zh-CN')"
      >
        中文
      </button>
      <button
        style="padding: 4px 14px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px"
        :style="{
          background: currentLocale === 'en-US' ? '#409EFF' : '#fff',
          color: currentLocale === 'en-US' ? '#fff' : '#333',
        }"
        @click="switchLocale('en-US')"
      >
        English
      </button>
      <span style="color: #999; font-size: 13px">当前: {{ currentLocale }}</span>
    </div>

    <div v-if="loading" style="padding: 40px; text-align: center; color: #999">加载中...</div>

    <template v-else>
      <!-- ========== dicts（默认）— REST + lazy: false ========== -->
      <h3>
        <code>'dicts'</code> — REST + lazy: false（默认）
        <span style="color: #67c23a; font-size: 12px; margin-left: 8px">⬤ 立即检查</span>
      </h3>
      <p style="color: #999; font-size: 13px">
        端点: <code>/api/dict/list</code> + <code>/api/dict/version</code>
      </p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse">
        <thead>
          <tr>
            <th>value</th>
            <th>label（useDict 翻译）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in d1Data" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ d1Translate(item.value) }}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top: 8px; color: #999; font-size: 13px">
        data 长度: {{ d1Data?.length }}
      </div>

      <hr style="margin: 24px 0" />

      <!-- ========== dicts2 — REST + lazy: false ========== -->
      <h3>
        <code>'dicts2'</code> — REST + lazy: false
        <span style="color: #67c23a; font-size: 12px; margin-left: 8px">⬤ 立即检查</span>
      </h3>
      <p style="color: #999; font-size: 13px">
        端点: <code>/api/dict/list2</code>（数据带【源2】前缀）
      </p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse">
        <thead>
          <tr>
            <th>value</th>
            <th>label（useDict 翻译）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in d2Data" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ d2Translate(item.value) }}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top: 8px; color: #999; font-size: 13px">
        data 长度: {{ d2Data?.length }}
      </div>

      <hr style="margin: 24px 0" />

      <!-- ========== dicts3 — REST + lazy: true ========== -->
      <h3>
        <code>'dicts3'</code> — REST + lazy: true
        <span style="color: #e6a23c; font-size: 12px; margin-left: 8px">⬤ 惰性检查</span>
      </h3>
      <p style="color: #999; font-size: 13px">
        端点: <code>/api/dict/list2</code>（同 dicts2，但 lazy: true，首次访问时才检查版本）
      </p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse">
        <thead>
          <tr>
            <th>value</th>
            <th>label（useDict 翻译）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in d3Data" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ d3Translate(item.value) }}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top: 8px; color: #999; font-size: 13px">
        data 长度: {{ d3Data?.length }}
      </div>

      <hr style="margin: 24px 0" />

      <!-- ========== dicts4 — 自定义 adapter + lazy: false ========== -->
      <h3>
        <code>'dicts4'</code> — 自定义 adapter + lazy: false
        <span style="color: #67c23a; font-size: 12px; margin-left: 8px">⬤ 立即检查</span>
      </h3>
      <p style="color: #999; font-size: 13px">
        适配器: <code>~/dict/dicts4-adapter.ts</code>（约定路径自动发现，硬编码数据带【源4】前缀）
      </p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse">
        <thead>
          <tr>
            <th>value</th>
            <th>label（useDict 翻译）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in d4Data" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ d4Translate(item.value) }}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top: 8px; color: #999; font-size: 13px">
        data 长度: {{ d4Data?.length }}
      </div>

      <hr style="margin: 24px 0" />

      <!-- ========== dicts5 — 自定义 adapter + lazy: true ========== -->
      <h3>
        <code>'dicts5'</code> — 自定义 adapter + lazy: true
        <span style="color: #e6a23c; font-size: 12px; margin-left: 8px">⬤ 惰性检查</span>
      </h3>
      <p style="color: #999; font-size: 13px">
        适配器: <code>~/dict/dicts5-adapter.ts</code>（约定路径自动发现，硬编码数据带【源5】前缀）
      </p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse">
        <thead>
          <tr>
            <th>value</th>
            <th>label（useDict 翻译）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in d5Data" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ d5Translate(item.value) }}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top: 8px; color: #999; font-size: 13px">
        data 长度: {{ d5Data?.length }}
      </div>

      <hr style="margin: 24px 0" />

      <!-- ========== 验证要点 ========== -->
      <div
        style="background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 4px"
      >
        <strong style="color: #856404">验证要点（F12 → Network）：</strong>
        <ol style="margin: 8px 0 0 16px; color: #666; font-size: 13px">
          <li>刷新页面 → 立即看到 dicts/dicts2/dicts4 的版本检查请求（lazy: false）</li>
          <li>dicts3/dicts5 的版本检查在页面加载时不会发出（lazy: true）</li>
          <li>首次导航到本页面时 dicts3/dicts5 才发起版本检查 → 字典请求</li>
          <li>
            各仓库数据前缀不同：dicts=原始 / dicts2=【源2】/ dicts3=【源2】/ dicts4=【源4】/
            dicts5=【源5】
          </li>
        </ol>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// 语言切换
const localeCookie = useCookie('i18n_redirected');
const currentLocale = computed(() => localeCookie.value || 'zh-CN');
function switchLocale(locale: string) {
  localeCookie.value = locale;
}

// dicts（默认）— REST + lazy: false（页面加载立即版本检查）
const { data: d1Data, translate: d1Translate, loading: d1Loading } = useDict('gender');

// dicts2 — REST + lazy: false（独立端点 /api/dict/list2）
const { data: d2Data, translate: d2Translate, loading: d2Loading } = useDict('dicts2', 'gender');

// dicts3 — REST + lazy: true（同 dicts2 端点，惰性版本检查）
const { data: d3Data, translate: d3Translate, loading: d3Loading } = useDict('dicts3', 'gender');

// dicts4 — 自定义 adapter（~/dict/dicts4-adapter.ts）+ lazy: false
const { data: d4Data, translate: d4Translate, loading: d4Loading } = useDict('dicts4', 'gender');

// dicts5 — 自定义 adapter（~/dict/dicts5-adapter.ts）+ lazy: true
const { data: d5Data, translate: d5Translate, loading: d5Loading } = useDict('dicts5', 'status');

const loading = computed(
  () => d1Loading.value || d2Loading.value || d3Loading.value || d4Loading.value || d5Loading.value,
);
</script>
