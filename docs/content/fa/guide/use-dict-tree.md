---
title: useDictTree
description: دریافت، ترجمه و بازگشت مسیر داده‌های دیکشنری درختی با عمق نامحدود.
---

# useDictTree

**هدف**: تسلط بر دیکشنری‌های درختی (مانند مناطق جغرافیایی، ساختار سازمانی) — دریافت، ترجمه و جستجوی مسیر.

## چه زمانی به این ویژگی نیاز دارید؟

- به یک انتخاب‌گر سه سطحی منطقه نیاز دارید
- مقدار فیلد "کد منطقه" (مثلاً `440104`) ذخیره می‌شود، اما باید مسیر کامل "Guangdong / Guangzhou / Yuexiu" نمایش داده شود
- باید تمام گره‌های والد یک گره مشخص را پیدا کنید (بازگشت مسیر)

## امضای کامل

```ts
useDictTree(type: string): UseDictTreeReturn
useDictTree(storeName: string, type: string): UseDictTreeReturn
```

## مقادیر بازگشتی

| ویژگی | نوع | توضیح |
|--------|------|-----------|
| `tree` | `ShallowRef<TreeNode[] \| null>` | داده‌های کامل درختی دیکشنری |
| `translate` | `(code: string \| number) => string` | ترجمه گره در هر عمقی |
| `findPath` | `(code: string \| number) => string[]` | بازگشت مسیر. کد گره برگ را دریافت کرده و آرایه label از ریشه تا آن گره را برمی‌گرداند |
| `loading` | `Ref<boolean>` | آیا در حال بارگذاری است |
| `refresh` | `() => Promise<void>` | بازنشانی دستی |

## findPath: بازگشت مسیر

این منحصربه‌فردترین ویژگی `useDictTree` است. فرض کنید داده‌های درختی منطقه به این صورت است:

```
Guangdong
├── Guangzhou
│   ├── Liwan (440103)
│   ├── Yuexiu (440104)
│   └── Tianhe (440106)
└── Shenzhen
    ├── Luohu (440303)
    └── Futian (440304)
```

شما کد منطقه `440104` را ذخیره می‌کنید، اما برای نمایش به `['Guangdong', 'Guangzhou', 'Yuexiu']` نیاز دارید:

```vue
<template>
  <p>کد منطقه: 440104</p>
  <p>مسیر کامل: {{ findPath('440104').join(' / ') }}</p>
  <!-- خروجی: Guangdong / Guangzhou / Yuexiu -->
</template>

<script setup lang="ts">
const { findPath } = useDictTree('region')
</script>
```

## یکپارچه‌سازی با Element Plus Cascader

```vue
<template>
  <el-cascader
    v-model="selected"
    :options="cascaderOptions"
    :props="{ value: 'code', label: 'label', children: 'children' }"
    placeholder="منطقه را انتخاب کنید"
    clearable
  />
</template>

<script setup lang="ts">
const { tree } = useDictTree('region')
const selected = ref([])

// el-cascader به value / label / children نیاز دارد
// TreeNode ما دقیقاً code / label / children دارد
// با ویژگی props نگاشت انجام می‌شود، نیازی به تبدیل داده نیست
const cascaderOptions = computed(() => tree.value ?? [])
</script>
```

## عمق نامحدود

`useDictTree` از درخت‌های با هر عمقی پشتیبانی می‌کند. `translate` و `findPath` هر دو به درستی جستجوی بازگشتی انجام می‌دهند.

## نکات

> `findPath` فقط در داده‌های `tree` که قبلاً بارگذاری شده‌اند جستجو می‌کند و درخواست شبکه اضافی ارسال نمی‌کند. قبل از فراخوانی مطمئن شوید `tree.value` برابر `null` نباشد.

## آنچه در این فصل آموختید

- [ ] استفاده از `useDictTree` برای دریافت داده‌های درختی دیکشنری
- [ ] استفاده از `findPath` برای بازگشت مسیر code ← مسیر کامل
- [ ] یکپارچه‌سازی با Element Plus Cascader
