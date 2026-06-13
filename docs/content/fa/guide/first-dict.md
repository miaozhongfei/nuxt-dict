---
title: اولین دیکشنری
description: از صفر، اولین dropdown دیکشنری خود را با useDict بنویسید.
---

**هدف**: نوشتن یک "dropdown جنسیت" که داده‌های گزینه‌ها را از API دیکشنری backend دریافت و در صفحه نمایش دهد.

## چه زمانی باید این فصل را بخوانید؟

- ماژول را نصب کرده‌اید و می‌خواهید ببینید چطور کار می‌کند
- می‌خواهید در کوتاه‌ترین زمان یک مثال کامل را اجرا کنید

## پیش‌نیاز: آماده‌سازی داده‌های دیکشنری

ماژول دیکشنری به یک API backend نیاز دارد. برای شروع سریع، یک API آزمایشی در پروژه Nuxt ایجاد می‌کنیم.

### ایجاد فایل API

یک فایل در `server/api/dict/list.get.ts` ایجاد کنید:

::code-group
  ```ts [server/api/dict/list.get.ts]
  export default defineEventHandler(() => {
    return {
      version: '1.0.0',
      data: {
        gender: {
          type: 'gender',
          items: [
            { value: 'male', label: 'مرد' },
            { value: 'female', label: 'زن' },
            { value: 'other', label: 'سایر' },
          ],
        },
      },
    }
  })
  ```

  ```ts [nuxt.config.ts]
  export default defineNuxtConfig({
    modules: ['@lacqjs/nuxt-dict'],
    dict: {
      api: {
        baseURL: '',                       // خالی یعنی API محلی
        dictEndpoint: '/api/dict/list',    // مسیر API لیست دیکشنری
      },
    },
  })
  ```
::

ساختار داده بازگشتی:
- `version`: شماره نسخه، برای تشخیص به‌روزرسانی داده‌ها
- `data`: یک شیء که کلید آن نام نوع دیکشنری (مثلاً `gender`) و مقدار آن لیست آیتم‌های آن نوع است

> **`baseURL: ''` یعنی چه؟** یعنی آدرس API نسبت به خود وب‌سایت است. اگر سرویس دیکشنری جداگانه‌ای دارید، `baseURL` را به `https://dict-api.example.com` تغییر دهید.

## مرحله ۱: نوشتن کد صفحه

فایل `pages/index.vue` را باز کرده و محتوای آن را به صورت زیر تغییر دهید:

```vue [pages/index.vue]
<template>
  <div style="max-width:400px;margin:40px auto;">
    <h2>انتخاب جنسیت</h2>

    <!-- در حال بارگذاری -->
    <p v-if="loading" style="color:#999;">در حال بارگذاری...</p>

    <!-- خطا -->
    <p v-else-if="error" style="color:red;">خطا: {{ error }}</p>

    <!-- موفقیت -->
    <div v-else>
      <select v-model="selected" style="width:100%;padding:8px;font-size:16px;">
        <option value="">لطفاً جنسیت را انتخاب کنید</option>
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      <p style="margin-top:12px;">انتخاب شما: <strong>{{ selected }}</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// فراخوانی useDict برای دریافت گزینه‌های دیکشنری
const { options, loading, error } = useDict('gender')

// مقدار انتخاب شده توسط کاربر
const selected = ref('')
</script>
```

## مرحله ۲: اجرا و مشاهده نتیجه

مطمئن شوید سرور توسعه در حال اجراست:

```bash
pnpm dev
```

`http://localhost:3000/` را باز کنید. باید ببینید:

1. یک dropdown با گزینه‌های "لطفاً جنسیت را انتخاب کنید"، "مرد"، "زن"، "سایر"
2. پس از انتخاب یک گزینه، مقدار انتخاب شده در زیر نمایش داده می‌شود

## توضیح خط به خط

### بخش قالب (`<template>`)

- `<select>` یک عنصر dropdown بومی HTML است
- `v-model="selected"` اتصال دوطرفه Vue: هرچه کاربر انتخاب کند، مقدار متغیر `selected` همان می‌شود
- `v-for="opt in options"` آرایه `options` را پیمایش کرده و برای هر عنصر یک `<option>` رندر می‌کند
- `:value="opt.value"` کد آیتم دیکشنری را به عنوان مقدار گزینه قرار می‌دهد
- `{{ opt.label }}` برچسب آیتم دیکشنری را به عنوان متن نمایشی گزینه قرار می‌دهد

### بخش اسکریپت (`<script setup>`)

`useDict('gender')` به ماژول می‌گوید: "من به داده‌های دیکشنری با نوع gender نیاز دارم"

سه مقدار بازگشتی:
- `options`: داده‌های دیکشنری با فرمت `[{ label: 'مرد', value: 'male' }, ...]` که مستقیماً برای dropdown قابل استفاده است
- `loading`: آیا در حال بارگذاری است (`true` / `false`)
- `error`: پیام خطا در صورت شکست بارگذاری

`useDict` در داخل این کارها را انجام می‌دهد:
1. ابتدا بررسی می‌کند آیا داده‌های `gender` در کش حافظه وجود دارد
2. اگر نه، IndexedDB (پایگاه داده مرورگر) را بررسی می‌کند
3. اگر باز هم پیدا نشد، به `/api/dict/list?types=gender` درخواست ارسال می‌کند
4. پس از دریافت داده‌ها، `{ code, label }` را به `{ value, label }` تبدیل می‌کند

## نکات

> **API دیکشنری باید داده‌ها را با فرمت مشخص شده برگرداند.** اگر API backend موجود شما فرمت متفاوتی دارد، اشکالی ندارد. ماژول از [آداپتور سفارشی](/advanced/custom-adapter) پشتیبانی می‌کند که می‌تواند با هر فرمتی سازگار شود.

## آنچه در این فصل آموختید

- [ ] ایجاد یک API دیکشنری آزمایشی در `server/api/`
- [ ] پیکربندی `dict.api` در `nuxt.config.ts` برای اشاره به API
- [ ] استفاده از `useDict()` برای دریافت داده‌ها و رندر dropdown
- [ ] درک کاربرد `loading`، `error` و `options`
- [ ] دریافت مقدار انتخاب شده توسط کاربر از طریق `v-model`
