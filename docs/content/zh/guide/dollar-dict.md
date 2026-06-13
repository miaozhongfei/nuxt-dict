---
title: $dict 同步翻译
description: 在模板中直接调用 $dict.translate() 做同步翻译，无需组件挂载。
---

# $dict 同步翻译

**本章目标**：学会在任何地方使用 `$dict` 做同步翻译。

## 什么时候需要这个功能？

- 在模板中快速翻译某个 code，不想单独声明 composable
- 在多个组件中翻译同一种字典类型，共享已缓存的翻译结果
- 翻译树形字典的层级路径（`$dict.translatePath`）

## $dict 是什么？

`$dict` 是一个注入到 NuxtApp 的全局翻译器，任何组件都可以直接使用。它访问的字典数据来自 `useDict` / `useDictTree` 等加载后存入的内存缓存。

> 字典数据必须先被某个 `useDict` / `useDictTree` 加载过，`$dict.translate()` 才能翻译。如果缓存中没有数据，返回 code 原文。

## API 签名

```ts
// 默认存储库
$dict.translate(type: string, value: string | number): string
// 指定存储库
$dict.translate(storeName: string, type: string, value: string | number): string

// 默认存储库 + 默认分隔符 ' / '
$dict.translatePath(type: string, value: string | number): string
// 指定存储库 + 自定义分隔符
$dict.translatePath(storeName: string, type: string, value: string | number, separator: string): string
```

## 使用示例

::code-group
  ```vue [基础用法]
  <template>
    <p>性别代码 'male' → {{ $dict.translate('gender', 'male') }}</p>
    <!-- 输出: 男 -->

    <p>状态代码 0 → {{ $dict.translate('status', 0) }}</p>
    <!-- 输出: 禁用 -->

    <p>区域代码 440104 → {{ $dict.translatePath('region', '440104') }}</p>
    <!-- 输出: 广东 / 广州 / 越秀区 -->

    <p>自定义分隔符 → {{ $dict.translatePath('dicts', 'region', '440104', ' → ') }}</p>
    <!-- 输出: 广东 → 广州 → 越秀区 -->
  </template>
  ```

  ```vue [表格列中使用]
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

## 与 useDict.translate 的区别

| 对比 | `$dict.translate()` | `useDict().translate()` |
|------|--------------------|-----------------------|
| 需要组件挂载 | 不需要 | `useDict` 在 `onMounted` 中加载 |
| 依赖的数据 | 全局内存缓存 | 当前组件的 `data` ref |
| 适用场景 | 快速翻译、多组件共享 | 需要 loading/error 状态的场景 |

> **最佳实践：** 同一个字典类型，在应用的某个根组件中用 `useDict` 加载一次，之后所有地方都用 `$dict.translate()` 翻译。

## 本章你学会了

- [ ] 在模板中使用 `$dict.translate()` 做同步翻译
- [ ] 使用 `$dict.translatePath()` 获取树形字典的层级路径
- [ ] 理解 `$dict` 与 `useDict().translate` 的适用场景差异
