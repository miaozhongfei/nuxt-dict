---
title: چند مخزنی
description: اتصال یک صفحه به چندین منبع داده دیکشنری backend به طور همزمان.
---

**هدف**: پیکربندی چندین مخزن داده دیکشنری، به طوری که یک صفحه بتواند همزمان از داده‌های دیکشنری سیستم‌های مختلف استفاده کند.

## چه زمانی به این ویژگی نیاز دارید؟

- صفحه اصلی مدیریت باید همزمان وضعیت سفارش "سیستم اصلی" و روش پرداخت "سیستم پرداخت" را نمایش دهد
- پروژه شما معماری میکروسرویس دارد و داده‌های دیکشنری در سرویس‌های backend مختلف ذخیره شده‌اند
- نیاز به اتصال دیکشنری سیستم‌های شخص ثالث دارید

## پیکربندی چند مخزنی

در `dict.stores` برای هر مخزن endpoint API را پیکربندی کنید:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-dict'],
  dict: {
    // پیکربندی سراسری API (مخزن پیش‌فرض 'dicts' از این استفاده می‌کند)
    api: {
      baseURL: '',
      dictEndpoint: '/api/dict/list',
    },
    // مخازن ذخیره‌سازی اضافی
    stores: {
      // مخزن payment: استفاده از آدرس پایه API مستقل
      payment: {
        baseURL: 'https://pay-api.example.com',
        dictEndpoint: '/v1/dictionary',
      },
      // مخزن logistics: استفاده از مسیر API مستقل
      logistics: {
        dictEndpoint: '/api/logistics/dict',
      },
      // مخزن static: استفاده از فایل آداپتور سفارشی، بدون درخواست HTTP
      // مسیر قراردادی ~/dict/static-adapter.ts به صورت خودکار شناسایی می‌شود
      static: {},
    },
  },
});
```

آداپتور مخزن `static` در یک فایل مستقل تعریف شده است:

```ts [~/dict/static-adapter.ts]
// آداپتور سفارشی مخزن static — بازگشت مستقیم داده‌های ثابت، بدون درخواست HTTP
export default defineDictAdapter({
  async fetchDict(_storeName, { types, locale }) {
    return {
      data: {
        priority: {
          type: 'priority',
          items: [
            { value: 'high', label: `اولویت بالا (${locale})` },
            { value: 'low', label: `اولویت پایین (${locale})` },
          ],
        },
      },
    };
  },
  async fetchVersion(_storeName) {
    return 'static-1.0';
  },
});
```

## قوانین وراثت پیکربندی

پیکربندی هر مخزن در `stores` از قوانین زیر پیروی می‌کند:

- **فیلدهای پیکربندی نشده** از `api` سراسری بالا به ارث می‌رسند
- **فیلدهای پیکربندی شده** مقدار سراسری را بازنویسی می‌کنند

برای مخزن `logistics` به عنوان مثال:

- `baseURL` پیکربندی نشده ← به ارث بردن `''` سراسری (API محلی)
- `dictEndpoint` به صورت `/api/logistics/dict` پیکربندی شده ← بازنویسی `/api/dict/list` سراسری
- `versionEndpoint` پیکربندی نشده ← به ارث بردن `/api/dict/version` سراسری

> فیلد `adapter` خاص است — **به ارث نمی‌رسد**. اگر برای یک مخزن `adapter` پیکربندی نکنید، ماژول به طور خودکار یک آداپتور REST پیش‌فرض برای آن ایجاد می‌کند (با استفاده از پیکربندی endpoint به ارث برده شده آن مخزن) به جای کپی کردن `api.adapter` سراسری. مقدار `adapter` یک رشته مسیر فایل است (مثلاً `'~/dict/static-adapter'`) که به فایلی اشاره می‌کند که آداپتور را با `defineDictAdapter()` صادر می‌کند.

## آداپتور سفارشی برای هر مخزن

هر مخزن نام‌گذاری شده می‌تواند فایل آداپتور سفارشی خود را پیکربندی کند (یک رشته مسیر فایل به فیلد `adapter` ارسال کنید) و جایگزین درخواست REST پیش‌فرض شود. فایل‌های آداپتور با استفاده از `defineDictAdapter()` تعریف می‌شوند و مسیر قراردادی `~/dict/{storeName}-adapter.ts` به صورت خودکار توسط ماژول شناسایی می‌شود. این برای موارد زیر مفید است:

- داده‌های دیکشنری از فایل‌های محلی یا پیکربندی ثابت می‌آیند و نیازی به HTTP نیست
- مخازن مختلف فرمت‌های backend بسیار متفاوتی دارند و نیاز به منطق آداپتور مستقل دارند
- برای توسعه و اشکال‌زدایی به داده‌های ساختگی نیاز دارید

مخازن با آداپتور سفارشی در composableها دقیقاً مانند سایر مخازن استفاده می‌شوند:

```vue
<template>
  <div>
    <h3>اولویت (static store — آداپتور سفارشی)</h3>
    <select v-model="priority">
      <option v-for="opt in staticOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
// مخزن static از فایل آداپتور سفارشی استفاده می‌کند، بدون درخواست شبکه
const { options: staticOptions } = useDict('static', 'priority');

const priority = ref('');
</script>
```

## استفاده از چند مخزن

```vue
<template>
  <div>
    <h3>وضعیت سفارش (سیستم اصلی)</h3>
    <select v-model="orderStatus">
      <option v-for="opt in orderOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <h3>روش پرداخت (سیستم پرداخت)</h3>
    <select v-model="payMethod">
      <option v-for="opt in payOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
// مخزن پیش‌فرض: استفاده از پیکربندی api سراسری
const { options: orderOptions } = useDict('order_status');

// مخزن payment: https://pay-api.example.com/v1/dictionary
const { options: payOptions } = useDict('payment', 'pay_method');

const orderStatus = ref('');
const payMethod = ref('');
</script>
```

## useDict تعیین مخزن

```vue
<script setup lang="ts">
// مخزن پیش‌فرض
const { data, translate } = useDict('order_status');

// مخزن payment
const { data: payData, translate: payTranslate } = useDict('payment', 'pay_status');
</script>
```

## useDictTree تعیین مخزن

```vue
<script setup lang="ts">
// دیکشنری درختی مخزن پیش‌فرض
const { tree } = useDictTree('region');

// دیکشنری درختی مخزن logistics
const { tree: locTree } = useDictTree('logistics', 'delivery_region');
</script>
```

## $dict تعیین مخزن

```vue
<template>
  <p>{{ $dict.translate('order_status', 'pending') }}</p>
  <!-- مخزن پیش‌فرض -->

  <p>{{ $dict.translate('pay_status', 1, { storeName: 'payment' }) }}</p>
  <!-- مخزن payment (از طریق opts.storeName) -->
</template>
```

## تشخیص نسخه مستقل هر مخزن

هر مخزن تشخیص نسخه مستقل خود را دارد. به‌روزرسانی نسخه یک مخزن فقط کش آن مخزن را باطل می‌کند و روی مخازن دیگر تأثیر نمی‌گذارد.

- کلید نسخه مخزن پیش‌فرض `dicts` = `__NUXT_DICT_VERSION__`
- کلید نسخه مخزن `payment` = `__NUXT_DICT_VERSION____payment`
- کلید نسخه مخزن `logistics` = `__NUXT_DICT_VERSION____logistics`

### بررسی نسخه تنبل (lazy)

پارامتر `lazy` زمان بررسی نسخه هر مخزن را کنترل می‌کند:

| مقدار lazy        | رفتار                                                                   |
| ----------------- | ----------------------------------------------------------------------- |
| `false` (پیش‌فرض) | بررسی نسخه فوراً هنگام بارگذاری صفحه اجرا می‌شود (مرحله `initialize()`) |
| `true`            | تا اولین فراخوانی `getDict()` برای آن مخزن به تأخیر می‌افتد             |

مثال پیکربندی:

```ts [nuxt.config.ts]
dict: {
  api: { lazy: false },  // مخزن پیش‌فرض فوراً بررسی می‌کند
  stores: {
    dicts2: { lazy: true },  // dicts2 به صورت تنبل بررسی می‌کند
  }
}
```

وقتی تعداد مخازن کم است از `false` (پیش‌فرض) استفاده کنید. وقتی مخازن زیادی دارید که ممکن است همه در هر صفحه استفاده نشوند، `true` تنظیم کنید تا از دسته‌ای از درخواست‌های نسخه هنگام راه‌اندازی جلوگیری شود.

## نکات

> `dicts` نام رزرو شده برای مخزن پیش‌فرض است. اگر `dicts` را در `stores` پیکربندی کنید، رفتار مخزن پیش‌فرض را بازنویسی می‌کند.

> مخازنی که در `stores` پیکربندی نشده‌اند از پیکربندی `api` سراسری استفاده می‌کنند. نوشتن `useDict('unknown_store', 'type')` خطا ایجاد نمی‌کند — به آداپتور مخزن پیش‌فرض `dicts` برمی‌گردد.

## تسلط کامل بر قوانین پیکربندی مخزن

### دو مفهوم پایه

**۱. مخزن (store) چیست؟**

مخزن یک "منبع داده دیکشنری" است. به عنوان مثال، پروژه شما ممکن است به سه نوع دیکشنری نیاز داشته باشد:

- جنسیت، وضعیت → از backend محلی در `/api/dict/list` دریافت می‌شود → این مخزن `dicts` است (مخزن پیش‌فرض)
- روش‌های پرداخت → از سیستم پرداخت در `https://pay-api.example.com` دریافت می‌شود → این مخزن `payment` است
- برچسب‌های ثابت → مستقیماً در کد نوشته شده‌اند، نیازی به HTTP نیست → این نیز یک مخزن است

هر مخزن با **نام مخزن** (`dicts`، `payment`، `static` و غیره) شناسایی می‌شود.

**۲. آداپتور (adapter) چیست؟**

آداپتور یک "ابزار دریافت داده" است. در یک فایل مستقل با استفاده از `defineDictAdapter()` تعریف می‌شود و دو وظیفه دارد:

- `fetchDict`: رفتن و دریافت داده‌های دیکشنری
- `fetchVersion`: بررسی اینکه آیا نسخه تغییر کرده است

ماژول با یک **آداپتور REST پیش‌فرض** داخلی همراه است — به طور خودکار درخواست‌های HTTP به آدرسی که پیکربندی کرده‌اید ارسال می‌کند. اگر به HTTP نیاز ندارید (مثلاً خواندن فایل‌های محلی)، یا فرمت backend شما متفاوت است، می‌توانید فایل آداپتور خود را بنویسید و جایگزین کنید.

### سه حالت وجود یک مخزن

یک مخزن می‌تواند در یکی از سه حالت زیر باشد:

| حالت                    | نحوه نوشتن در `stores`        | اثر                                                                                                                                              |
| ----------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **اعلام نشده**          | اصلاً ننویسید                 | ماژول از وجود آن خبر ندارد. وقتی `useDict('myStore', 'type')` را فراخوانی می‌کنید، مستقیماً از آداپتور `dicts` استفاده مجدد می‌کند               |
| **اعلام شده، اما خالی** | `myStore: {}`                 | ماژول می‌داند این مخزن وجود دارد، اما همه فیلدها خالی هستند. یک آداپتور REST مستقل ایجاد می‌کند و همه فیلدهای آدرس را از `api` سراسری کپی می‌کند |
| **اعلام شده با فیلدها** | `myStore: { baseURL: '...' }` | از فیلدهایی که تنظیم کرده‌اید استفاده می‌کند + فیلدهای تنظیم نشده را از `api` سراسری کپی می‌کند                                                  |

**مقایسه کد سه حالت:**

```ts [nuxt.config.ts]
// api سراسری — منبع مقدار پیش‌فرض برای فیلدهای تنظیم نشده همه مخازن
api: { baseURL: '/api', dictEndpoint: '/dict/list', versionEndpoint: '/dict/version' }
stores: {
  // حالت ۱: payment اصلاً اعلام نشده است
  // → فراخوانی useDict('payment', 'type') بی‌صدا به آداپتور dicts برمی‌گردد، endpoint همچنان /api/dict/list است

  // حالت ۲: logistics اعلام شده اما خالی
  logistics: {},
  // → آداپتور REST مستقل، endpoint به صورت /api/dict/list به ارث می‌رسد
  // → کش و تشخیص نسخه مستقل خود را دارد

  // حالت ۳: static فایل آداپتور پیکربندی شده دارد
  static: { adapter: '~/dict/static-adapter' },
  // → از فایل آداپتور سفارشی خود استفاده می‌کند، بدون درخواست HTTP
}
```

**تفاوت حالت ۱ و حالت ۲:**

حتی اگر endpointها یکسان باشند:

- حالت ۱: `payment` و `dicts` یک آداپتور و یک کش را به اشتراک می‌گذارند — وقتی نسخه `dicts` به‌روزرسانی می‌شود، کش `payment` نیز باطل می‌شود
- حالت ۲: `logistics` آداپتور و کش مستقل خود را دارد — وقتی نسخه `dicts` به‌روزرسانی می‌شود، `logistics` تحت تأثیر قرار نمی‌گیرد

> چه زمانی باید از حالت ۲ (اعلام شیء خالی) استفاده کنید؟ وقتی می‌خواهید نوع‌های مختلف دیکشنری از یک endpoint یکسان کش مستقل داشته باشند.

### توضیح دقیق پنج فیلد

هر مخزن می‌تواند پنج فیلد را پیکربندی کند:

| فیلد              | نوع   | هدف                                        | مثال                          |
| ----------------- | ----- | ------------------------------------------ | ----------------------------- |
| `baseURL`         | رشته  | آدرس سرور                                  | `https://pay-api.example.com` |
| `dictEndpoint`    | رشته  | مسیر endpoint برای دریافت داده‌های دیکشنری | `/v1/dictionary`              |
| `versionEndpoint` | رشته  | مسیر endpoint برای دریافت شماره نسخه       | `/v1/dictionary/version`      |
| `adapter`         | رشته  | مسیر فایل آداپتور سفارشی                   | `'~/dict/static-adapter'`     |
| `lazy`            | بولین | آیا بررسی نسخه به صورت تنبل انجام شود      | `true`                        |

**URL نهایی درخواست = `baseURL` + endpoint متناظر.**

مثال:

```ts [nuxt.config.ts]
payment: {
  baseURL: 'https://pay-api.example.com',
  dictEndpoint: '/v1/dictionary',
  versionEndpoint: '/v1/dictionary/version',
}
// درخواست واقعی: https://pay-api.example.com/v1/dictionary?types=gender,status&lang=zh-CN
// درخواست نسخه: https://pay-api.example.com/v1/dictionary/version
```

### قوانین وراثت به تفصیل

#### قانون ۱: سه فیلد آدرس همیشه به طور خودکار به ارث می‌رسند

اگر یک مخزن `baseURL`، `dictEndpoint` یا `versionEndpoint` را تنظیم نکند، به طور خودکار از پیکربندی `api` سراسری کپی می‌شوند.

**مثال ۱: یکی تنظیم شده، دو تا نشده**

```ts [nuxt.config.ts]
api: { baseURL: '/api', dictEndpoint: '/dict/list', versionEndpoint: '/dict/version' }
stores: {
  payment: { baseURL: 'https://pay-api.example.com' },
  // ↑ فقط baseURL تنظیم شده است
}
```

نتیجه نهایی `payment`:

- `baseURL` = `'https://pay-api.example.com'` ← از مقدار شما استفاده می‌کند
- `dictEndpoint` = `'/dict/list'` ← از سراسری کپی شده
- `versionEndpoint` = `'/dict/version'` ← از سراسری کپی شده

**مثال ۲: هیچکدام تنظیم نشده**

```ts [nuxt.config.ts]
api: { baseURL: '/api', dictEndpoint: '/dict/list', versionEndpoint: '/dict/version' }
stores: {
  logistics: {},
  // ↑ هیچی تنظیم نشده
}
```

نتیجه نهایی `logistics`:

- `baseURL` = `'/api'` ← از سراسری کپی شده
- `dictEndpoint` = `'/dict/list'` ← از سراسری کپی شده
- `versionEndpoint` = `'/dict/version'` ← از سراسری کپی شده

**مثال ۳: همه تنظیم شده**

```ts [nuxt.config.ts]
api: { baseURL: '/api', dictEndpoint: '/dict/list', versionEndpoint: '/dict/version' }
stores: {
  payment: {
    baseURL: 'https://pay-api.example.com',
    dictEndpoint: '/v1/dictionary',
    versionEndpoint: '/v1/dictionary/version',
  },
}
```

نتیجه نهایی `payment`: هر سه از مقادیر شما استفاده می‌کنند، پیکربندی سراسری کاملاً نادیده گرفته می‌شود.

#### قانون ۲: آداپتورها به طور خودکار به ارث نمی‌رسند

این **مهم‌ترین قانون و آسان‌ترین برای اشتباه گرفتن** است.

**۲.۱ مخزن پیش‌فرض `dicts`**

```ts [nuxt.config.ts]
api: {
  baseURL: '/api',
  dictEndpoint: '/dict/list',
  adapter: '~/dict/dict-adapter',   // ← مسیر فایل آداپتور سفارشی سراسری
}
```

اولویت مخزن پیش‌فرض `dicts`:
۱. بررسی می‌کند که آیا `api.adapter` مسیر فایل دارد → اگر بله، فایل آداپتور را بارگذاری کن
۲. اگر نه → بررسی مسیر قراردادی `~/dict/dict-adapter.ts` → اگر وجود داشته باشد، به صورت خودکار بارگذاری کن
۳. هیچکدام → به طور خودکار آداپتور REST ایجاد کن (با استفاده از سه فیلد آدرس سراسری)

**۲.۲ مخازن نام‌گذاری شده (`stores.xxx`)**

```ts [nuxt.config.ts]
api: {
  adapter: '~/dict/dict-adapter',   // ← مخازن نام‌گذاری شده این آداپتور را نمی‌بینند!
}
stores: {
  payment: {
    baseURL: 'https://pay-api.example.com',
    // آداپتور پیکربندی نشده
  },
}
```

منطق مخزن `payment`:
۱. بررسی می‌کند که آیا `stores.payment.adapter` مسیر فایل دارد → ندارد
۲. بررسی مسیر قراردادی `~/dict/payment-adapter.ts` → وجود ندارد
۳. به `api.adapter` نگاه نمی‌کند → **از آن می‌گذرد**
۴. به طور خودکار آداپتور REST ایجاد می‌کند (با استفاده از فیلدهای آدرس به ارث برده شده)

بنابراین `payment` در نهایت `https://pay-api.example.com/dict/list` (REST) را فراخوانی می‌کند، نه آداپتور سفارشی سراسری شما را.

**چرا اینطور طراحی شده است؟**

```ts [nuxt.config.ts]
// اگر وراثت آداپتور مجاز بود، این وضعیت awkward رخ می‌داد:
api: { adapter: '~/dict/dict-adapter' }

stores: {
  payment: {},
  logistics: {},
  static: {},
}
// payment، logistics و static همه فایل آداپتور یکسانی را بارگذاری می‌کردند
// fetchDict آداپتور برای هر سه فراخوانی می‌شد، فقط با storeName متمایز می‌شد
// این «به ارث بردن داده» نیست — این «استفاده از یک ابزار برای مدیریت چندین منبع» است
```

اگر واقعاً می‌خواهید یک ابزار چندین مخزن را مدیریت کند، فقط داخل آداپتور بر اساس `storeName` مسیریابی کنید — نیازی به «به ارث بردن» همان فایل به هر مخزن نیست.

**۲.۳ رابطه بین آداپتور سراسری و آداپتورهای هر مخزن**

هر دو رویکرد نتایج مشابهی دارند، اما برای سناریوهای مختلف مناسب هستند:

**رویکرد A: فایل آداپتور سراسری + مسیریابی storeName**

::code-group

```ts [~/dict/dict-adapter.ts]
// آداپتور سراسری — مسیریابی به آدرس‌های مختلف بر اساس storeName
export default defineDictAdapter({
  async fetchDict(storeName, { types, locale }) {
    const urls: Record<string, string> = {
      dicts: '/api/dict/list',
      payment: 'https://pay-api.example.com/v1/dictionary',
      logistics: '/api/logistics/dict',
    };
    const url = urls[storeName];
    const res = await fetch(`${url}?types=${types.join(',')}&lang=${locale}`);
    return res.json();
  },
  async fetchVersion(storeName) {
    const res = await fetch(`/api/version?store=${storeName}`);
    return (await res.json()).version;
  },
});
```

```ts [nuxt.config.ts]
// مسیر قراردادی ~/dict/dict-adapter.ts به صورت خودکار شناسایی می‌شود
stores: {
  payment: {},     // اعلام شده تا ماژول بداند وجود دارد — پیکربندی endpoint مهم نیست
  logistics: {},   // چون آداپتور مسیریابی را داخلی مدیریت می‌کند
}
```

::

مناسب برای: همه مخازن از پروتکل یکسان (HTTP) استفاده می‌کنند، فقط آدرس‌ها متفاوت هستند، منطق آداپتور یکسان است.

**رویکرد B: فایل‌های آداپتور مستقل هر مخزن**

::code-group

```ts [~/dict/static-adapter.ts]
// آداپتور سفارشی مخزن static — کاملاً سفارشی، بدون HTTP
export default defineDictAdapter({
  async fetchDict() {
    return {
      data: {
        /* ... */
      },
    };
  },
  async fetchVersion() {
    return '1.0';
  },
});
```

```ts [nuxt.config.ts]
api: { baseURL: '', dictEndpoint: '/api/dict/list' },
stores: {
  payment: {
    baseURL: 'https://pay-api.example.com',
    dictEndpoint: '/v1/dictionary',
    // آداپتور نوشته نشده ← به طور خودکار آداپتور REST ایجاد می‌کند
  },
  // مسیر قراردادی ~/dict/static-adapter.ts به صورت خودکار شناسایی می‌شود
  static: {},
}
```

::

مناسب برای: مخازن مختلف از رویکردهای کاملاً متفاوت دریافت داده استفاده می‌کنند (HTTP در مقابل فایل‌های محلی در مقابل GraphQL).

### جدول مرجع کامل

همه حالات ممکن فهرست شده است:

| نوع مخزن                      | شرط                             | آداپتور استفاده شده                                                                                                                                                     |
| ----------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dicts` (پیش‌فرض)             | `api.adapter` تنظیم شده         | فایل آداپتور مشخص شده توسط `api.adapter` را بارگذاری می‌کند                                                                                                             |
| `dicts` (پیش‌فرض)             | `api.adapter` تنظیم نشده        | مسیر قراردادی `~/dict/dict-adapter.ts` را بررسی می‌کند → اگر وجود داشته باشد بارگذاری؛ در غیر این صورت REST: `api.baseURL` + `api.dictEndpoint` + `api.versionEndpoint` |
| `xxx` (اعلام شده در `stores`) | `stores.xxx.adapter` تنظیم شده  | فایل آداپتور مشخص شده توسط `stores.xxx.adapter` را بارگذاری می‌کند (تحت تأثیر `api.adapter` قرار نمی‌گیرد)                                                              |
| `xxx` (اعلام شده در `stores`) | `stores.xxx.adapter` تنظیم نشده | مسیر قراردادی `~/dict/xxx-adapter.ts` را بررسی می‌کند → اگر وجود داشته باشد بارگذاری؛ در غیر این صورت REST با فیلدهای آدرس به ارث برده شده. کش و تشخیص نسخه مستقل دارد  |
| `yyy` (اعلام نشده)            | —                               | از آداپتور `dicts` استفاده مجدد می‌کند، کش یکسان را به اشتراک می‌گذارد                                                                                                  |

### خلاصه در یک جمله

> سه فیلد آدرس (baseURL / dictEndpoint / versionEndpoint) همیشه پر می‌شوند — اگر تنظیم نکنید، از پیکربندی سراسری کپی می‌شوند. اگر مسیر فایل آداپتور را تنظیم کنید، آن آداپتور استفاده می‌شود؛ اگر تنظیم نکنید، مسیر قراردادی (`~/dict/dict-adapter.ts` یا `~/dict/{storeName}-adapter.ts`) بررسی می‌شود؛ اگر آن هم وجود نداشته باشد، یک ابزار HTTP برایتان نصب می‌شود — هرگز از آداپتور سراسری کپی نمی‌شود.

## آنچه در این فصل آموختید

- [ ] پیکربندی چندین مخزن داده دیکشنری در `dict.stores`
- [ ] درک قوانین وراثت پیکربندی مخزن
- [ ] تعیین نام مخزن در composableها
- [ ] درک مکانیزم تشخیص نسخه مستقل هر مخزن
