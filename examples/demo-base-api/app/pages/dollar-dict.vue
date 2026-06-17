<template>
  <div>
    <h1>$dict 同步翻译</h1>
    <p>
      <code>$dict</code> 是注入到全局的同步翻译器，不产生响应式依赖，适合在表格 formatter、computed
      等场景使用。使用前需通过 <code>useDict</code> 或 <code>useDictTree</code> 加载数据到缓存。
    </p>

    <!-- 1. translate -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">$dict.translate(type, code)</span>
        <span style="color: #6b7280; font-size: 0.85rem">— 编码→文本</span>
      </div>
      <p class="demo-card__desc">
        最基本的同步翻译，传字典类型和编码值，返回 label。可选
        <code>&#123; field: 'color' }</code> 读取扩展字段。
      </p>

      <table class="demo-table">
        <thead>
          <tr>
            <th>字典类型</th>
            <th>编码</th>
            <th>translate()</th>
            <th>translate(&#123; field: 'color' })</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>gender</code></td>
            <td><code>'male'</code></td>
            <td>{{ $dict.translate('gender', 'male') }}</td>
            <td>—</td>
          </tr>
          <tr>
            <td><code>gender</code></td>
            <td><code>'female'</code></td>
            <td>{{ $dict.translate('gender', 'female') }}</td>
            <td>—</td>
          </tr>
          <tr>
            <td><code>status</code></td>
            <td><code>1</code></td>
            <td>{{ $dict.translate('status', 1) }}</td>
            <td>
              <span
                class="color-dot"
                :style="{ background: $dict.translate('status', 1, { field: 'color' }) }"
              />
              {{ $dict.translate('status', 1, { field: 'color' }) }}
            </td>
          </tr>
          <tr>
            <td><code>status</code></td>
            <td><code>0</code></td>
            <td>{{ $dict.translate('status', 0) }}</td>
            <td>
              <span
                class="color-dot"
                :style="{ background: $dict.translate('status', 0, { field: 'color' }) }"
              />
              {{ $dict.translate('status', 0, { field: 'color' }) }}
            </td>
          </tr>
          <tr>
            <td><code>industry</code></td>
            <td><code>'it'</code></td>
            <td>{{ $dict.translate('industry', 'it') }}</td>
            <td>
              <span
                class="color-dot"
                :style="{ background: $dict.translate('industry', 'it', { field: 'color' }) }"
              />
              {{ $dict.translate('industry', 'it', { field: 'color' }) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 2. translatePath -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">$dict.translatePath(type, code)</span>
        <span style="color: #6b7280; font-size: 0.85rem">— 树形路径</span>
      </div>
      <p class="demo-card__desc">
        在树形字典中查找编码的完整层级路径，默认用 <code> / </code> 分隔。
      </p>

      <table class="demo-table">
        <thead>
          <tr>
            <th>编码</th>
            <th>默认分隔符</th>
            <th>自定义：&#123; separator: ' → ' }</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>'110101'</code></td>
            <td>{{ $dict.translatePath('region', '110101') }}</td>
            <td>{{ $dict.translatePath('region', '110101', { separator: ' → ' }) }}</td>
          </tr>
          <tr>
            <td><code>'440104'</code></td>
            <td>{{ $dict.translatePath('region', '440104') }}</td>
            <td>{{ $dict.translatePath('region', '440104', { separator: ' → ' }) }}</td>
          </tr>
          <tr>
            <td><code>'440304'</code></td>
            <td>{{ $dict.translatePath('region', '440304') }}</td>
            <td>{{ $dict.translatePath('region', '440304', { separator: ' → ' }) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 3. translateData -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">$dict.translateData(data, mapping)</span>
        <span style="color: #6b7280; font-size: 0.85rem">— 批量翻译</span>
      </div>
      <p class="demo-card__desc">
        对数据对象中的多个编码字段批量翻译，返回追加了 <code>_label</code> 后缀字段的新对象（不修改原对象）。
      </p>

      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap">
        <div>
          <div style="font-weight: 600; margin-bottom: 0.35rem">原始数据：</div>
          <div class="demo-result--info" style="font-size: 0.85rem">{{ tableRow }}</div>
        </div>
        <div>
          <div style="font-weight: 600; margin-bottom: 0.35rem">translateData 后：</div>
          <div class="demo-result" style="font-size: 0.85rem">{{ translatedRow }}</div>
        </div>
      </div>
    </div>

    <!-- 4. getDictItem -->
    <div class="demo-card">
      <div class="demo-card__header">
        <span class="demo-card__badge">$dict.getDictItem(type, code)</span>
        <span style="color: #6b7280; font-size: 0.85rem">— 获取完整条目</span>
      </div>
      <p class="demo-card__desc">
        返回完整 <code>DictItem</code> 对象（含 value、label 及所有扩展字段），未命中返回
        <code>undefined</code>。
      </p>

      <table class="demo-table">
        <thead>
          <tr>
            <th>调用</th>
            <th>返回值</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>$dict.getDictItem('status', 1)</code></td>
            <td
              class="demo-result--info"
              style="border: none; border-radius: 0; padding: 0.25rem 0.5rem"
            >
              {{ statusItem }}
            </td>
          </tr>
          <tr>
            <td><code>$dict.getDictItem('industry', 'it')</code></td>
            <td
              class="demo-result--info"
              style="border: none; border-radius: 0; padding: 0.25rem 0.5rem"
            >
              {{ industryItem }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
useDict('gender');
useDict('status');
useDict('industry');
useDictTree('region');

const { $dict } = useNuxtApp();

const tableRow = { name: '张三', gender: 'male', status: 1 };

const translatedRow = computed(() =>
  $dict.translateData({ ...tableRow }, { gender: 'gender', status: 'status' }),
);

const statusItem = computed(() => JSON.stringify($dict.getDictItem('status', 1)));
const industryItem = computed(() => JSON.stringify($dict.getDictItem('industry', 'it')));
</script>
