---
title: Nuxt Dict
description: A Nuxt module for convenient dictionary data management based on Element Plus and Vant dictionaries.
---

Nuxt Dict is a Nuxt 4 module that helps you manage **dictionary data** (also called data dictionaries, code tables, or enumeration values) in your projects.

## What is dictionary data?

In your daily development, you will inevitably encounter these scenarios:

- A "Gender" column in a table displays `male` / `female`, but users want to see "Male" / "Female"
- A dropdown's "Industry Type" options need to be fetched from a backend API
- A region picker requires tree-structured data
- You need the same dropdown to show different text in Chinese and English environments

**The dictionary module was designed specifically to solve these problems.**

## What can this module do?

- **useDict** — Fetch dictionary data by type, providing a `translate(value)` translation interface
- **useDict** — Directly output `{ label, value }[]` format, seamlessly integrating with Element Plus / Vant
- **useDictTree** — Tree dictionary support, providing `findPath` for path backtracking (e.g., finding the full region path from a district code)
- **useLocale** — Multi-language management, supporting cookie / header / query language detection
- **Three-tier Cache** — Memory → IndexedDB → API, with automatic version detection and invalidation
- **SSR Prefetch** — Server-side prefetching of dictionary data for instant first-screen rendering

## Quick Start (3 Steps)

1. **Install**: `pnpm add @lacqjs/nuxt-dict`
2. **Register**: Add `'@lacqjs/nuxt-dict'` to the `modules` array in `nuxt.config.ts`
3. **Use**: Write `const { data, translate } = useDict('gender')` in any page

> **What background do you need?** Ideally, you don't need to know Nuxt, or even Vue. As long as you can use a computer and type, follow this documentation step by step, and you'll be able to use dictionary functionality in your project.

## Document Navigation

| Section | For Whom |
|---------|----------|
| [Environment Setup](/guide/environment) → [Installation](/guide/installation) → [Your First Dict](/guide/first-dict) | Zero experience, first time using |
| [useDict](/guide/use-dict) ∼ [$dict](/guide/dollar-dict) | Understanding each API in detail |
| [Multi-Store](/advanced/multi-store) ∼ [Full Config](/advanced/full-config) | Deep usage in production |
| [Element Plus](/integration/element-plus) / [Vant](/integration/vant) | Complete UI library integration examples |
| [API Reference](/appendix/api-reference) / [FAQ](/appendix/faq) | Quick lookup |

Ready? Start with [Environment Setup](/guide/environment)!
