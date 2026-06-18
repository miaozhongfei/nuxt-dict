---
title: $dict مترجم همزمان
description: فراخوانی مستقیم $dict.translate() در قالب‌ها برای ترجمه همزمان بدون نیاز به mount کامپوننت.
---

**هدف**: یادگیری استفاده از `$dict` در هر جایی برای ترجمه همزمان.

## چه زمانی به این ویژگی نیاز دارید؟

- ترجمه سریع یک code در قالب بدون تعریف composable جداگانه
- اشتراک‌گذاری نتایج ترجمه در چندین کامپوننت
- ترجمه مسیرهای سلسله‌مراتبی دیکشنری درختی (`$dict.translatePath`)
- دریافت آیتم کامل دیکشنری (مانند دسترسی به فیلدهای color, icon از طریق `$dict.getDictItem`)

## $dict چیست؟

`$dict` یک مترجم سراسری است که به NuxtApp تزریق شده و از هر کامپوننتی بدون نیاز به import قابل دسترسی است. داده‌های آن از کش حافظه‌ای می‌آیند که توسط `useDict` / `useDictTree` پر شده است.

> داده‌های دیکشنری باید ابتدا توسط یک `useDict` / `useDictTree` بارگذاری شده باشند تا `$dict.translate()` بتواند ترجمه کند. اگر کش خالی باشد، code اصلی برگردانده می‌شود.

## امضای API

### $dict.translate()

```ts
// ترجمه دیکشنری تخت
$dict.translate(type: string, value: string | number): string

// ترجمه دیکشنری تخت + گزینه‌های سفارشی (storeName / field)
$dict.translate(type: string, value: string | number, opts: { storeName?: string; field?: string }): string
```

### $dict.translatePath()

```ts
// مسیر دیکشنری درختی (جداکننده پیش‌فرض ' / ')
$dict.translatePath(type: string, value: string | number): string

// مسیر دیکشنری درختی + گزینه‌های سفارشی (storeName / field / separator)
$dict.translatePath(type: string, value: string | number, opts: { storeName?: string; field?: string; separator?: string }): string
```

### $dict.translateData()

```ts
// ترجمه دسته‌ای اشیاء داده
$dict.translateData(data: Record<string, unknown>, mapping: Record<string, string | { type: string; storeName?: string }>, suffix?: string): Record<string, unknown>
```

### $dict.getDictItem()

```ts
// دریافت آیتم کامل دیکشنری (DictItem برگردانده می‌شود)
$dict.getDictItem(type: string, value: string | number): DictItem | undefined
// تعیین مخزن
$dict.getDictItem(type: string, value: string | number, opts: { storeName?: string }): DictItem | undefined
```

## مثال‌های استفاده

::code-group

```vue [پایه]
<template>
  <div>
    <p>کد جنسیت 'male' ← {{ $dict.translate('gender', 'male') }}</p>
    <!-- خروجی: مرد -->

    <p>کد وضعیت 0 ← {{ $dict.translate('status', 0) }}</p>
    <!-- خروجی: غیرفعال -->

    <p>مسیر کامل کد منطقه 440104 ← {{ $dict.translatePath('region', '440104') }}</p>
    <!-- خروجی: Guangdong / Guangzhou / Yuexiu -->
  </div>
</template>
```

```vue [در جدول]
<template>
  <table>
    <tr v-for="user in users" :key="user.id">
      <td>{{ user.name }}</td>
      <td>{{ $dict.translate('status', user.status) }}</td>
      <td>{{ $dict.translate('gender', user.gender) }}</td>
    </tr>
  </table>
</template>
```

```vue [ترجمه دسته‌ای (translateData)]
<script setup>
const tableData = [
  { id: 1, gender: 'male', status: 0, name: 'Zhang San' },
  { id: 2, gender: 'female', status: 1, name: 'Li Si' },
];
const processed = tableData.map((row) =>
  $dict.translateData(row, { gender: 'gender', status: { type: 'status', storeName: 'dicts2' } }),
);
// برای مخزن پیش‌فرض string، برای مخزن دیگر { type, storeName? }
</script>
<template>
  <table>
    <tr v-for="row in processed" :key="row.id">
      <td>{{ row.name }}</td>
      <td>{{ row.gender_label }}</td>
      <td>{{ row.status_label }}</td>
    </tr>
  </table>
</template>
```

::

## translatePath با جداکننده سفارشی

```vue
<template>
  <p>{{ $dict.translatePath('region', '440104') }}</p>
  <!-- پیش‌فرض: Guangdong / Guangzhou / Yuexiu -->

  <p>{{ $dict.translatePath('region', '440104', { storeName: 'dicts', separator: ' ← ' }) }}</p>
  <!-- جداکننده و مخزن سفارشی از طریق opts -->
  <!-- خروجی: Guangdong ← Guangzhou ← Yuexiu -->
</template>
```

## translateData — ترجمه دسته‌ای اشیاء داده

وقتی نیاز به ترجمه همزمان چندین فیلد کد در یک شیء داده دارید، از `translateData` استفاده کنید.

```vue
<template>
  <table>
    <tr v-for="row in processed" :key="row.id">
      <td>{{ row.gender_label }}</td>
      <td>{{ row.status_label }}</td>
      <td>{{ row.name }}</td>
    </tr>
  </table>
</template>

<script setup>
const tableData = [
  { id: 1, gender: 'male', status: 0, name: 'Zhang San' },
  { id: 2, gender: 'female', status: 1, name: 'Li Si' },
]

// ترجمه دسته‌ای: نگاشت { فیلدمنبع: نوع‌دیکشنری } → شیء جدید با فیلدهای ترجمه شده
const processed = tableData.map(row =>
  $dict.translateData(row, { gender: 'gender', status: 'status' })
)

// مثال با مخزن دیگر: { type, storeName? } برای مخزن غیر پیش‌فرض
$dict.translateData(
  { orderStatus: 1 },
  { orderStatus: { type: 'pay_status', storeName: 'payment' } }
)
// → { orderStatus: 1, orderStatus_label: 'پرداخت شده' }
</script>
// [{ gender: 'male', gender_label: 'مرد', status: 0, status_label: 'غیرفعال', ... }, ...]
</script>
```

> وقتی مقدار mapping یک `string` باشد، از مخزن پیش‌فرض استفاده می‌شود. برای تعیین مخزن مشخص از `{ type: 'status', storeName: 'dicts2' }` استفاده کنید. پسوند به‌طور پیش‌فرض `'_label'` است و با پارامتر سوم قابل تغییر است.

## getDictItem — دریافت آیتم کامل دیکشنری

وقتی به شیء کامل DictItem نیاز دارید (نه فقط یک فیلد متنی) از `getDictItem` استفاده کنید. مثلاً برای دسترسی به فیلد `color` در پراپرتی‌های کامپوننت.

```vue
<template>
  <el-tag :color="(statusItem?.color as string)" effect="dark">
    {{ statusItem?.label }}
  </el-tag>
</template>

<script setup>
// useDict داده‌ها را پیش‌بارگذاری می‌کند
useDict('status');

// دریافت شیء کامل DictItem با دسترسی به color و سایر ویژگی‌ها
const statusItem = computed(() => $dict.getDictItem('status', 1));
// → { value: 1, label: 'فعال', color: '#67C23A' }

// مخزن دیگر
const item2 = $dict.getDictItem('status', 1, { storeName: 'dicts2' });
</script>
```

> مقدار بازگشتی `DictItem | undefined` است. در صورت عدم وجود در کش `undefined` برمی‌گرداند، برخلاف `translate()` که کد اصلی را برمی‌گرداند.

## محدوده: useDict در مقابل $dict

| ویژگی            | useDict                           | $dict                          |
| ---------------- | --------------------------------- | ------------------------------ |
| **محدوده**       | داخلی کامپوننت                    | سراسری                         |
| **واکنش‌گرا**    | ✅ با تغییر داده رندر مجدد می‌شود | ❌ رندر مجدد نمی‌شود           |
| **محل فراخوانی** | سطح بالای `<script setup>`        | هرجا (تمپلیت / computed / JS)  |
| **بارگذاری**     | خودکار در زمان mount              | خواندن از کش موجود             |
| **مناسب برای**   | اتصال تمپلیت                      | computed / formatter / منطق JS |

`useDict` داده‌های دیکشنری را درون کامپوننت مدیریت می‌کند، مناسب برای اتصال تمپلیت. `$dict` مستقیماً از کش سراسری می‌خواند، بدون اثرات جانبی واکنش‌گرا، مناسب برای computed و formatter جدول.

## نکات

> `$dict` واکنش‌گرا نیست. اگر داده‌ها هنوز بارگذاری نشده باشند، `$dict.translate()` کد اصلی را برمی‌گرداند. از `v-if` برای اطمینان از بارگذاری داده‌ها استفاده کنید.

> `$dict.translatePath` فقط برای دیکشنری‌های درختی کار می‌کند. اگر فیلد `tree` خالی باشد، کد اصلی برگردانده می‌شود.

## آنچه در این فصل آموختید

- [ ] استفاده از `$dict.translate()` برای ترجمه همزمان در قالب
- [ ] استفاده از `$dict.translatePath()` برای دریافت مسیر سلسله‌مراتبی
- [ ] استفاده از `$dict.getDictItem()` برای دریافت آیتم کامل دیکشنری
- [ ] درک تفاوت `$dict` و `useDict().translate` و موارد کاربرد هر کدام
