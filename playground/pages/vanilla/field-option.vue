<template>
  <div>
    <h2>自定义字段 translate / translatePath</h2>
    <p style="color:#666;">通过 opts.field 指定取字典项的哪个字段，默认取 label。支持 translate / translatePath。</p>

    <div v-if="loading" style="padding:40px;text-align:center;color:#999;">加载中...</div>

    <template v-else>
      <h3>1. 基础 translate —— 取 color 字段</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
        <thead>
          <tr>
            <th>code</th>
            <th>label</th>
            <th>field: 'color'</th>
            <th>field: 'color'（新写法 object）</th>
            <th>field: 'notExist' → 回退 label</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in statusData" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ item.label }}</td>
            <td>{{ statusTranslate(item.value, { field: 'color' }) }}</td>
            <td>{{ $dict.translate('status', item.value, { field: 'color' }) }}</td>
            <td>{{ $dict.translate('status', item.value, { field: 'notExist' }) }}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top:24px;">2. 指定存储库 + 自定义字段</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
        <thead>
          <tr>
            <th>code</th>
            <th>label（dicts2）</th>
            <th>field: 'color'（旧写法 store 位首位）</th>
            <th>field: 'color'（新写法 object）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store2StatusData" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ item.label }}</td>
            <td>{{ $dict.translate('status', item.value, { storeName: 'dicts2', field: 'color' }) }}</td>
            <td>{{ $dict.translate('status', item.value, { storeName: 'dicts2', field: 'color' }) }}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top:24px;">3. translatePath —— 自定义字段</h3>
      <p style="color:#666;">树形字典节点自定义字段。默认取 label，传入 field 取其他字段。</p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;margin-bottom:8px;">
        <thead>
          <tr>
            <th>code</th>
            <th>label 路径</th>
            <th>field: 'value' 路径</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="code in treeExamples" :key="code">
            <td>{{ code }}</td>
            <td>{{ $dict.translatePath('region', code) }}</td>
            <td>{{ $dict.translatePath('region', code, { field: 'value' }) }}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top:24px;">4. useDict translate —— 自定义字段</h3>
      <p style="color:#666;">useDict 返回的 translate 函数也可传入 opts.field。</p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
        <thead><tr><th>value</th><th>label</th><th>field: 'value'</th><th>field: 'notExist' → 回退 label</th></tr></thead>
        <tbody>
          <tr v-for="item in genderData" :key="item.value">
            <td>{{ item.value }}</td>
            <td>{{ genderTranslate(item.value) }}</td>
            <td>{{ genderTranslate(item.value, { field: 'value' }) }}</td>
            <td>{{ genderTranslate(item.value, { field: 'notExist' }) }}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top:24px;">5. 新写法示例</h3>
      <p style="color:#666;">所有 storeName 统一通过 opts 对象传入。</p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
        <thead>
          <tr>
            <th>code</th>
            <th>$dict.translate 2 参</th>
            <th>$dict.translate（opts.storeName）</th>
            <th>$dict.translatePath（opts.storeName + separator）</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>male</td>
            <td>{{ $dict.translate('gender', 'male') }}</td>
            <td>{{ $dict.translate('gender', 'male', { storeName: 'dicts2' }) }}</td>
            <td>{{ $dict.translatePath('region', '330108', { storeName: 'dicts2', separator: ' → ' }) }}</td>
          </tr>
          <tr>
            <td>female</td>
            <td>{{ $dict.translate('gender', 'female') }}</td>
            <td>{{ $dict.translate('gender', 'female', { storeName: 'dicts2' }) }}</td>
            <td>{{ $dict.translatePath('region', '440104', { storeName: 'dicts2', separator: ' → ' }) }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script setup lang="ts">
const { data: statusData, translate: statusTranslate, loading } = useDict('status')
const { data: genderData, translate: genderTranslate } = useDict('gender')
const { data: store2StatusData } = useDict('dicts2', 'status')

const treeExamples = ['440104', '330108', '310115', '110101']
</script>
