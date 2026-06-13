---
title: $dict Synchronous Translation
description: Call $dict.translate() directly in templates for synchronous translation without component mounting.
---

# $dict Synchronous Translation

**Goal**: Learn to use `$dict` anywhere for synchronous translation.

## When do you need this?

- Quickly translate a code in a template without declaring a composable
- Share cached translation results across multiple components
- Translate tree dictionary path hierarchies (`$dict.translatePath`)

## What is $dict?

`$dict` is a global translator injected into NuxtApp, accessible from any component. Its data comes from the memory cache populated by `useDict` / `useDictTree` calls.

> Dictionary data must have been loaded by some `useDict` / `useDictTree` before `$dict.translate()` can translate it. If the cache is empty, it returns the code as-is.

## API Signature

```ts
// Default store
$dict.translate(type: string, code: string | number): string
// Specific store
$dict.translate(storeName: string, type: string, code: string | number): string

// Default store + default separator ' / '
$dict.translatePath(type: string, code: string | number): string
// Specific store + custom separator
$dict.translatePath(storeName: string, type: string, code: string | number, separator: string): string
```

## Usage Examples

::code-group
  ```vue [Basic]
  <template>
    <p>Gender code 'male' → {{ $dict.translate('gender', 'male') }}</p>
    <!-- Output: Male -->

    <p>Status code 0 → {{ $dict.translate('status', 0) }}</p>
    <!-- Output: Disabled -->

    <p>Region code 440104 path → {{ $dict.translatePath('region', '440104') }}</p>
    <!-- Output: Guangdong / Guangzhou / Yuexiu -->
  </template>
  ```

  ```vue [In Table Columns]
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

## vs useDict.translate

| | `$dict.translate()` | `useDict().translate()` |
|---|---|---|
| Mount required | No | `useDict` loads in `onMounted` |
| Data source | Global memory cache | Component's `data` ref |
| Use case | Quick translation, shared across components | When loading/error state is needed |

> **Best practice:** Load a dictionary type once with `useDict` in a root component, then use `$dict.translate()` everywhere else.

## What You Learned

- [ ] Use `$dict.translate()` for synchronous translation in templates
- [ ] Use `$dict.translatePath()` for tree dictionary path hierarchies
- [ ] Understand the difference between `$dict` and `useDict().translate`
