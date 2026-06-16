<template>
  <div>
    <h2>useLocale — 语言切换</h2>
    <p style="color: #666">切换语言后，字典翻译结果自动更新</p>

    <p>
      当前语言：<b>{{ locale }}</b>
    </p>
    <div style="display: flex; gap: 8px; margin-bottom: 16px">
      <button @click="setLocale('zh-CN')" :style="btnStyle('zh-CN')">中文</button>
      <button @click="setLocale('en-US')" :style="btnStyle('en-US')">English</button>
      <button @click="setLocale('ja-JP')" :style="btnStyle('ja-JP')">日本語</button>
    </div>

    <div style="background: #f9f9f9; padding: 16px; border-radius: 8px">
      <p>gender.male → {{ gT('male') }}</p>
      <p>gender.female → {{ gT('female') }}</p>
      <p>status.1 → {{ sT(1) }}</p>
    </div>

    <p style="margin-top: 16px; font-size: 13px; color: #999">
      en-US 和 ja-JP 语言未配置对应 mock 数据时，返回原始 code 作为回退。
    </p>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useLocale();
const { translate: gT } = useDict('gender');
const { translate: sT } = useDict('status');

function btnStyle(lang: string) {
  return {
    padding: '6px 16px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: locale.value === lang ? '#409EFF' : '#fff',
    color: locale.value === lang ? '#fff' : '#333',
  };
}
</script>
