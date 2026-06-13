---
title: $dict مترجم همزمان
description: فراخوانی مستقیم $dict.translate() در قالب‌ها برای ترجمه همزمان بدون نیاز به mount کامپوننت.
---

**هدف**: یادگیری استفاده از `$dict` در هر جایی برای ترجمه همزمان.

## چه زمانی به این ویژگی نیاز دارید؟

- ترجمه سریع یک code در قالب بدون تعریف composable جداگانه
- اشتراک‌گذاری نتایج ترجمه در چندین کامپوننت
- ترجمه مسیرهای سلسله‌مراتبی دیکشنری درختی (`$dict.translatePath`)

## $dict چیست؟

`$dict` یک مترجم سراسری است که به NuxtApp تزریق شده و از هر کامپوننتی بدون نیاز به import قابل دسترسی است. داده‌های آن از کش حافظه‌ای می‌آیند که توسط `useDict` / `useDictTree` پر شده است.

> داده‌های دیکشنری باید ابتدا توسط یک `useDict` / `useDictTree` بارگذاری شده باشند تا `$dict.translate()` بتواند ترجمه کند. اگر کش خالی باشد، code اصلی برگردانده می‌شود.

## امضای API

### $dict.translate()

```ts
// مخزن پیش‌فرض (dicts)
$dict.translate(type: string, value: string | number): string

// مخزن مشخص
$dict.translate(storeName: string, type: string, value: string | number): string
```

### $dict.translatePath()

```ts
// مخزن پیش‌فرض + جداکننده پیش‌فرض ' / '
$dict.translatePath(type: string, value: string | number): string

// مخزن مشخص + جداکننده پیش‌فرض
$dict.translatePath(storeName: string, type: string, value: string | number): string

// مخزن مشخص + جداکننده سفارشی
$dict.translatePath(storeName: string, type: string, value: string | number, separator: string): string
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
::

## translatePath با جداکننده سفارشی

```vue
<template>
  <p>{{ $dict.translatePath('region', '440104') }}</p>
  <!-- پیش‌فرض: Guangdong / Guangzhou / Yuexiu -->

  <p>{{ $dict.translatePath('dicts', 'region', '440104', ' ← ') }}</p>
  <!-- جداکننده سفارشی (برای مخزن پیش‌فرض باید 'dicts' را صریحاً ذکر کرد) -->
  <!-- خروجی: Guangdong ← Guangzhou ← Yuexiu -->
</template>
```

## مقایسه با useDict.translate

| معیار | `$dict.translate()` | `useDict().translate()` |
|--------|---------------------|------------------------|
| نیاز به mount کامپوننت | خیر | `useDict` در `onMounted` بارگذاری می‌شود |
| داده منبع | کش سراسری حافظه | `data` ref کامپوننت فعلی |
| زمان بارگذاری | هر زمان قابل فراخوانی | پس از mount کامپوننت |
| کاربرد مناسب | ترجمه سریع، اشتراک بین کامپوننت‌ها | مواقعی که به وضعیت loading/error نیاز دارید |

> **بهترین روش:** یک نوع دیکشنری را یکبار در یک کامپوننت ریشه با `useDict` بارگذاری کنید، سپس در همه جا از `$dict.translate()` استفاده کنید.

## نکات

> `$dict` واکنش‌گرا نیست. اگر داده‌ها هنوز بارگذاری نشده باشند، `$dict.translate()` کد اصلی را برمی‌گرداند. از `v-if` برای اطمینان از بارگذاری داده‌ها استفاده کنید.

> `$dict.translatePath` فقط برای دیکشنری‌های درختی کار می‌کند. اگر فیلد `tree` خالی باشد، کد اصلی برگردانده می‌شود.

## آنچه در این فصل آموختید

- [ ] استفاده از `$dict.translate()` برای ترجمه همزمان در قالب
- [ ] استفاده از `$dict.translatePath()` برای دریافت مسیر سلسله‌مراتبی
- [ ] درک تفاوت `$dict` و `useDict().translate` و موارد کاربرد هر کدام
