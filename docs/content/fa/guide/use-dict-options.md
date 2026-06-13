---
title: useDictOptions
description: خروجی مستقیم با فرمت { label, value } برای یکپارچه‌سازی بی‌دردسر با Element Plus، Vant و غیره.
---

# useDictOptions

**هدف**: یادگیری استفاده از `useDictOptions` برای یکپارچه‌سازی سریع با کامپوننت‌های Element Plus و Vant.

## چه زمانی به این ویژگی نیاز دارید؟

- از Element Plus استفاده می‌کنید و `<el-select>` به `:options="[{ label, value }]"` نیاز دارد
- از Vant استفاده می‌کنید و `<van-picker>` به `columns` نیاز دارد
- نمی‌خواهید به صورت دستی `{ code, label }` را به `{ value, label }` تبدیل کنید

## امضای کامل

```ts
useDictOptions(type: string): UseDictOptionsReturn
useDictOptions(storeName: string, type: string): UseDictOptionsReturn
```

## مقادیر بازگشتی

| ویژگی | نوع | توضیح |
|--------|------|-----------|
| `options` | `ComputedRef<{ label: string; value: string \| number }[]>` | ویژگی محاسباتی که به طور خودکار `code` را به `value` نگاشت می‌کند |
| `loading` | `Ref<boolean>` | آیا در حال بارگذاری است |
| `refresh` | `() => Promise<void>` | بازنشانی دستی |

`useDictOptions` در داخل `useDict` را فراخوانی می‌کند، بنابراین رفتار کش و loading یکسان است. تفاوت فقط در `options` با فرمت `{ label, value }` است.

## مثال‌های استفاده

::code-group
  ```vue [Element Plus]
  <template>
    <el-select v-model="selected" placeholder="نوع صنعت را انتخاب کنید" :loading="loading">
      <el-option
        v-for="opt in options"
        :key="opt.value"
        :label="opt.label"
        :value="opt.value"
      />
    </el-select>
    <p>مقدار انتخاب شده: {{ selected }}</p>
  </template>

  <script setup lang="ts">
  const { options, loading } = useDictOptions('industry')
  const selected = ref('')
  </script>
  ```

  ```vue [Select بومی]
  <template>
    <select v-model="selected">
      <option value="">لطفاً انتخاب کنید</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </template>

  <script setup lang="ts">
  const { options } = useDictOptions('gender')
  const selected = ref('')
  </script>
  ```
::

## نکات

> `options` یک ویژگی محاسباتی است و با تغییر داده‌های دیکشنری به طور خودکار به‌روز می‌شود. نیازی به watch دستی داده‌ها نیست.

> فیلدهای اضافی در `options` ظاهر نمی‌شوند. اگر به فیلدهای اضافی مانند `color` نیاز دارید، از `useDict` برای دریافت `data` خام استفاده کنید.

## آنچه در این فصل آموختید

- [ ] استفاده از `useDictOptions` برای دریافت گزینه‌های با فرمت `{ label, value }`
- [ ] یکپارچه‌سازی با کامپوننت `<el-select>` در Element Plus
- [ ] یکپارچه‌سازی با عنصر `<select>` بومی
- [ ] درک اینکه `options` یک ویژگی محاسباتی است و با داده‌ها به طور خودکار به‌روز می‌شود
