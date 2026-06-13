---
title: useDict
description: خروجی مستقیم با فرمت { value, label } برای یکپارچه‌سازی بی‌دردسر با Element Plus، Vant و غیره.
---

**هدف**: یادگیری استفاده از `useDict` برای یکپارچه‌سازی سریع با کامپوننت‌های Element Plus و Vant.

## چه زمانی به این ویژگی نیاز دارید؟

- از Element Plus استفاده می‌کنید و `<el-select>` به فرمت `[{ value, label }]` نیاز دارد
- از Vant استفاده می‌کنید و `<van-picker>` به `columns` نیاز دارد
- به داده‌های دیکشنری مستقیماً قابل اتصال به کامپوننت‌های UI نیاز دارید

## امضای کامل

```ts
useDict(type: string): useDictReturn
useDict(storeName: string, type: string): useDictReturn
```

## مقادیر بازگشتی

| ویژگی | نوع | توضیح |
|--------|------|-----------|
| `data` | `ShallowRef<DictItem[] \| null>` | آرایه داده‌های دیکشنری، هر آیتم `{ value, label, ...فیلدهای اضافی }` |
| `translate` | `(value: string \| number) => string` | تابع ترجمه همزمان |
| `loading` | `Ref<boolean>` | آیا در حال بارگذاری است |
| `refresh` | `() => Promise<void>` | بازنشانی دستی |

فیلد `value` در `DictItem` به طور طبیعی با فیلد `value` کتابخانه‌های UI مطابقت دارد — بدون نیاز به نگاشت دستی.

## مثال‌های استفاده

::code-group
  ```vue [Element Plus]
  <template>
    <el-select v-model="selected" placeholder="نوع صنعت را انتخاب کنید" :loading="loading">
      <el-option
        v-for="opt in data"
        :key="opt.value"
        :label="opt.label"
        :value="opt.value"
      />
    </el-select>
    <p>مقدار انتخاب شده: {{ selected }}</p>
  </template>

  <script setup lang="ts">
  const { data, loading } = useDict('industry')
  const selected = ref('')
  </script>
  ```

  ```vue [Select بومی]
  <template>
    <select v-model="selected">
      <option value="">لطفاً انتخاب کنید</option>
      <option v-for="opt in data" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </template>

  <script setup lang="ts">
  const { data } = useDict('gender')
  const selected = ref('')
  </script>
  ```
::

## نکات

> `data` شامل آیتم‌های `DictItem` با فیلد `value` اصلی است که مستقیماً با کتابخانه‌های UI مطابقت دارد — بدون نیاز به `map` دستی.

> فیلدهای اضافی (مانند `color`) در هر آیتم `data` حفظ می‌شوند و می‌توانند مستقیماً در props کامپوننت استفاده شوند. مثال: `<el-tag :color="item.color">`.

## آنچه در این فصل آموختید

- [ ] استفاده از `useDict` برای داده‌های با فرمت `{ value, label }`
- [ ] یکپارچه‌سازی با کامپوننت `<el-select>` در Element Plus
- [ ] یکپارچه‌سازی با عنصر `<select>` بومی
