<template>
  <div>
    <h1>多仓库 Multi-Store</h1>
    <p>
      5 个仓库覆盖 REST/自定义适配器 × lazy on/off 全组合。 每个仓库至少 3
      个字典类型，数据前缀区分来源。
    </p>

    <div style="margin: 8px 0 16px; display: flex; align-items: center; gap: 8px">
      <span style="color: #666">语言切换：</span>
      <NuxtLink
        :to="localePath($route.path, 'zh')"
        style="padding: 4px 14px; border: 1px solid #ccc; border-radius: 4px; text-decoration: none"
        :style="{
          background: $i18n.locale === 'zh' ? '#409EFF' : '#fff',
          color: $i18n.locale === 'zh' ? '#fff' : '#333',
        }"
      >
        中文
      </NuxtLink>
      <NuxtLink
        :to="localePath($route.path, 'en')"
        style="padding: 4px 14px; border: 1px solid #ccc; border-radius: 4px; text-decoration: none"
        :style="{
          background: $i18n.locale === 'en' ? '#409EFF' : '#fff',
          color: $i18n.locale === 'en' ? '#fff' : '#333',
        }"
      >
        EN
      </NuxtLink>
    </div>

    <div v-if="loading" style="padding: 40px; text-align: center; color: #999">加载中...</div>

    <template v-else>
      <!-- ========== dicts（默认）— REST + lazy: false ========== -->
      <div class="demo-card">
        <div class="demo-card__header">
          <span class="demo-card__badge">dicts（默认）</span>
          <span style="color: #67c23a; font-size: 12px; margin-left: 8px"
            >⬤ REST + lazy: false</span
          >
        </div>
        <p class="demo-card__desc">
          端点: <code>/api/dict/list</code> — gender / status / industry
        </p>
        <table class="demo-table">
          <thead>
            <tr>
              <th>type</th>
              <th>value</th>
              <th>translate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in d1Gender" :key="'d1g-' + item.value">
              <td>gender</td>
              <td>{{ item.value }}</td>
              <td>{{ d1GenderT(item.value) }}</td>
            </tr>
            <tr v-for="item in d1Status" :key="'d1s-' + item.value">
              <td>status</td>
              <td>{{ item.value }}</td>
              <td>{{ d1StatusT(item.value) }}</td>
            </tr>
            <tr v-for="item in d1Industry" :key="'d1i-' + item.value">
              <td>industry</td>
              <td>{{ item.value }}</td>
              <td>{{ d1IndustryT(item.value) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ========== dicts2 — REST + lazy: false ========== -->
      <div class="demo-card">
        <div class="demo-card__header">
          <span class="demo-card__badge">dicts2</span>
          <span style="color: #67c23a; font-size: 12px; margin-left: 8px"
            >⬤ REST + lazy: false</span
          >
        </div>
        <p class="demo-card__desc">
          端点: <code>/api/dict/list2</code> — gender(【源2】) / status(【源2】) / priority
        </p>
        <table class="demo-table">
          <thead>
            <tr>
              <th>type</th>
              <th>value</th>
              <th>translate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in d2Gender" :key="'d2g-' + item.value">
              <td>gender</td>
              <td>{{ item.value }}</td>
              <td>{{ d2GenderT(item.value) }}</td>
            </tr>
            <tr v-for="item in d2Status" :key="'d2s-' + item.value">
              <td>status</td>
              <td>{{ item.value }}</td>
              <td>{{ d2StatusT(item.value) }}</td>
            </tr>
            <tr v-for="item in d2Priority" :key="'d2p-' + item.value">
              <td>priority</td>
              <td>{{ item.value }}</td>
              <td>{{ d2PriorityT(item.value) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ========== dicts3 — REST + lazy: true ========== -->
      <div class="demo-card">
        <div class="demo-card__header">
          <span class="demo-card__badge">dicts3</span>
          <span style="color: #e6a23c; font-size: 12px; margin-left: 8px">⬤ REST + lazy: true</span>
        </div>
        <p class="demo-card__desc">
          端点: <code>/api/dict/list2</code>（同 dicts2 数据，惰性版本检查）
        </p>
        <table class="demo-table">
          <thead>
            <tr>
              <th>type</th>
              <th>value</th>
              <th>translate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in d3Gender" :key="'d3g-' + item.value">
              <td>gender</td>
              <td>{{ item.value }}</td>
              <td>{{ d3GenderT(item.value) }}</td>
            </tr>
            <tr v-for="item in d3Status" :key="'d3s-' + item.value">
              <td>status</td>
              <td>{{ item.value }}</td>
              <td>{{ d3StatusT(item.value) }}</td>
            </tr>
            <tr v-for="item in d3Priority" :key="'d3p-' + item.value">
              <td>priority</td>
              <td>{{ item.value }}</td>
              <td>{{ d3PriorityT(item.value) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ========== dicts4 — adapter + lazy: false ========== -->
      <div class="demo-card">
        <div class="demo-card__header">
          <span class="demo-card__badge">dicts4</span>
          <span style="color: #67c23a; font-size: 12px; margin-left: 8px"
            >⬤ adapter + lazy: false</span
          >
        </div>
        <p class="demo-card__desc">
          适配器: <code>~/dict/dicts4-adapter.ts</code> — gender(【源4】) / paymentStatus /
          orderType
        </p>
        <table class="demo-table">
          <thead>
            <tr>
              <th>type</th>
              <th>value</th>
              <th>translate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in d4Gender" :key="'d4g-' + item.value">
              <td>gender</td>
              <td>{{ item.value }}</td>
              <td>{{ d4GenderT(item.value) }}</td>
            </tr>
            <tr v-for="item in d4Payment" :key="'d4p-' + item.value">
              <td>paymentStatus</td>
              <td>{{ item.value }}</td>
              <td>{{ d4PaymentT(item.value) }}</td>
            </tr>
            <tr v-for="item in d4Order" :key="'d4o-' + item.value">
              <td>orderType</td>
              <td>{{ item.value }}</td>
              <td>{{ d4OrderT(item.value) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ========== dicts5 — adapter + lazy: true ========== -->
      <div class="demo-card">
        <div class="demo-card__header">
          <span class="demo-card__badge">dicts5</span>
          <span style="color: #e6a23c; font-size: 12px; margin-left: 8px"
            >⬤ adapter + lazy: true</span
          >
        </div>
        <p class="demo-card__desc">
          适配器: <code>~/dict/dicts5-adapter.ts</code> — currency / logistics / warehouse
        </p>
        <table class="demo-table">
          <thead>
            <tr>
              <th>type</th>
              <th>value</th>
              <th>translate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in d5Currency" :key="'d5c-' + item.value">
              <td>currency</td>
              <td>{{ item.value }}</td>
              <td>{{ d5CurrencyT(item.value) }}</td>
            </tr>
            <tr v-for="item in d5Logistics" :key="'d5l-' + item.value">
              <td>logistics</td>
              <td>{{ item.value }}</td>
              <td>{{ d5LogisticsT(item.value) }}</td>
            </tr>
            <tr v-for="item in d5Warehouse" :key="'d5w-' + item.value">
              <td>warehouse</td>
              <td>{{ item.value }}</td>
              <td>{{ d5WarehouseT(item.value) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ========== 验证要点 ========== -->
      <div
        style="
          background: #fff3cd;
          border: 1px solid #ffc107;
          padding: 12px;
          border-radius: 4px;
          margin-top: 16px;
        "
      >
        <strong style="color: #856404">验证要点（F12 → Network）：</strong>
        <ol style="margin: 8px 0 0 16px; color: #666; font-size: 13px">
          <li>刷新页面 → dicts/dicts2/dicts4 立即发出版本检查请求（lazy: false）</li>
          <li>dicts3/dicts5 的版本检查延迟到首次 getDict 调用时（lazy: true）</li>
          <li>各仓库数据前缀不同：无前缀 / 【源2】/ 【源4】/ 【源5】</li>
          <li>切换语言后所有仓库数据同步更新</li>
        </ol>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

// dicts（默认）— REST + lazy: false
const { data: d1Gender, translate: d1GenderT, loading: l1 } = useDict('gender');
const { data: d1Status, translate: d1StatusT, loading: l2 } = useDict('status');
const { data: d1Industry, translate: d1IndustryT, loading: l3 } = useDict('industry');

// dicts2 — REST + lazy: false
const { data: d2Gender, translate: d2GenderT, loading: l4 } = useDict('dicts2', 'gender');
const { data: d2Status, translate: d2StatusT, loading: l5 } = useDict('dicts2', 'status');
const { data: d2Priority, translate: d2PriorityT, loading: l6 } = useDict('dicts2', 'priority');

// dicts3 — REST + lazy: true
const { data: d3Gender, translate: d3GenderT, loading: l7 } = useDict('dicts3', 'gender');
const { data: d3Status, translate: d3StatusT, loading: l8 } = useDict('dicts3', 'status');
const { data: d3Priority, translate: d3PriorityT, loading: l9 } = useDict('dicts3', 'priority');

// dicts4 — adapter + lazy: false
const { data: d4Gender, translate: d4GenderT, loading: l10 } = useDict('dicts4', 'gender');
const { data: d4Payment, translate: d4PaymentT, loading: l11 } = useDict('dicts4', 'paymentStatus');
const { data: d4Order, translate: d4OrderT, loading: l12 } = useDict('dicts4', 'orderType');

// dicts5 — adapter + lazy: true
const { data: d5Currency, translate: d5CurrencyT, loading: l13 } = useDict('dicts5', 'currency');
const { data: d5Logistics, translate: d5LogisticsT, loading: l14 } = useDict('dicts5', 'logistics');
const { data: d5Warehouse, translate: d5WarehouseT, loading: l15 } = useDict('dicts5', 'warehouse');

const loading = computed(
  () =>
    l1.value ||
    l2.value ||
    l3.value ||
    l4.value ||
    l5.value ||
    l6.value ||
    l7.value ||
    l8.value ||
    l9.value ||
    l10.value ||
    l11.value ||
    l12.value ||
    l13.value ||
    l14.value ||
    l15.value,
);
</script>
