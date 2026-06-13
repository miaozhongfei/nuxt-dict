---
title: useDict
description: راهنمای کامل useDict — دریافت داده‌های دیکشنری و ترجمه.
---

# useDict

**هدف**: تسلط بر تمام الگوهای `useDict` شامل ترجمه پایه، مدیریت loading/error، بازنشانی دستی و تعیین مخزن.

## چه زمانی به این ویژگی نیاز دارید؟

- یک جدول دارید که ستون "وضعیت" آن `0` / `1` را ذخیره می‌کند، اما می‌خواهید کاربران "فعال" / "غیرفعال" ببینند
- هم به داده‌های خام دیکشنری و هم به قابلیت ترجمه نیاز دارید
- می‌خواهید کنترل کامل بر نحوه رندر داده‌های دیکشنری داشته باشید

## امضای کامل

```ts
// استفاده از مخزن پیش‌فرض
useDict(type: string): UseDictReturn

// تعیین مخزن
useDict(storeName: string, type: string): UseDictReturn
```

## مقادیر بازگشتی

| ویژگی | نوع | توضیح |
|--------|------|-----------|
| `data` | `ShallowRef<DictItem[] \| null>` | آرایه داده‌های خام دیکشنری. در ابتدا `null`، پس از بارگذاری `[{ value: 0, label: 'غیرفعال' }, ...]` می‌شود |
| `translate` | `(value: string \| number) => string` | تابع ترجمه همزمان. کد را دریافت کرده و label متناظر را برمی‌گرداند. در صورت عدم وجود، کد را به صورت رشته برمی‌گرداند |
| `loading` | `Ref<boolean>` | آیا در حال بارگذاری است |
| `error` | `Ref<string \| null>` | پیام خطا در صورت شکست |
| `refresh` | `() => Promise<void>` | بازنشانی دستی، کش را نادیده می‌گیرد |

## مثال پایه

```vue
<template>
  <div>
    <!-- در حال بارگذاری -->
    <p v-if="loading">در حال بارگذاری...</p>

    <!-- خطا -->
    <div v-else-if="error" style="background:#fef0f0;padding:16px;border-radius:8px;">
      <p style="color:#F56C6C;">{{ error }}</p>
      <button @click="doRefresh">تلاش مجدد</button>
    </div>

    <!-- جدول داده‌ها -->
    <table v-else border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      <thead>
        <tr><th>کد</th><th>برچسب</th><th>بررسی ترجمه</th></tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.value">
          <td>{{ item.value }}</td>
          <td>{{ item.label }}</td>
          <td>{{ translate(item.value) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
// فراخوانی useDict برای دریافت داده‌های دیکشنری
const { data, translate, loading, error, refresh } = useDict('status')

// تابع بازنشانی دستی
function doRefresh() { refresh() }
</script>
```

## جزئیات تابع ترجمه

`translate(value)` یک تابع همزمان است که فقط در **داده‌های بارگذاری شده در کش حافظه** جستجو می‌کند. نیازی به انتظار برای درخواست شبکه ندارد:

```vue
<template>
  <table>
    <tr v-for="user in userList" :key="user.id">
      <td>{{ user.name }}</td>
      <!-- user.status عدد 0/1/2 است ← به "غیرفعال"/"فعال"/"در انتظار" ترجمه می‌شود -->
      <td>{{ translate(user.status) }}</td>
    </tr>
  </table>
</template>
```

> **چرا ترجمه همزمان است؟** وقتی `useDict('status')` داده‌ها را در زمان mount کامپوننت بارگذاری کرد، داده‌های دیکشنری `status` در کش حافظه ذخیره می‌شوند. سپس `translate(statusCode)` مستقیماً از حافظه جستجو می‌کند.

## تبدیل خودکار نوع کد

کدهای آیتم دیکشنری ممکن است `number` باشند (مثلاً `0`)، در حالی که داده‌های کسب‌وکار شما `string` باشد (مثلاً `'0'`). `translate()` به طور خودکار هر دو طرف را به رشته تبدیل می‌کند:

```ts
translate(0)   // → 'غیرفعال'
translate('0') // → 'غیرفعال'
```

## بازنشانی دستی

وقتی می‌دانید داده‌های دیکشنری backend به‌روزرسانی شده‌اند، `refresh()` را فراخوانی کنید:

```vue
<script setup lang="ts">
const { data, refresh } = useDict('status')

// backend اطلاع می‌دهد دیکشنری به‌روز شده ← کش را پاک کرده و دوباره درخواست بده
function onDictUpdated() { refresh() }
</script>
```

رفتار `refresh()`: پاک کردن کش حافظه ← رد کردن IndexedDB ← درخواست مستقیم به سرور ← نوشتن در IndexedDB + حافظه.

## تعیین مخزن

```vue
<script setup lang="ts">
// مخزن پیش‌فرض 'dicts'
const { data } = useDict('gender')

// مخزن 'payment'
const { data: payData } = useDict('payment', 'status')
</script>
```

> پیکربندی چند مخزنی را در [چند مخزنی](/advanced/multi-store) ببینید.

## نکات

> `translate()` در حالت `data === null` هم قابل فراخوانی است، اما کد اصلی را برمی‌گرداند. اطمینان حاصل کنید که از `v-if="data"` یا وضعیت loading استفاده می‌کنید.

## آنچه در این فصل آموختید

- [ ] استفاده از `useDict('type')` برای دریافت داده‌ها و تابع ترجمه
- [ ] مدیریت صحیح سه وضعیت `loading` / `error`
- [ ] استفاده از `translate()` برای تبدیل code ← label
- [ ] فراخوانی `refresh()` برای بازنشانی اجباری کش
- [ ] استفاده از `useDict('store', 'type')` برای تعیین مخزن
