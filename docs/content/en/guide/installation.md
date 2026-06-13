---
title: Installation
description: Install @lacqjs/nuxt-dict into your Nuxt project.
---

**Goal**: Install the Nuxt Dict module into the Nuxt project created in the previous chapter and verify the installation.

## Step 1: Install the dependency

Run in your project root directory:

```bash
pnpm add @lacqjs/nuxt-dict
```

## Step 2: Register the module

Open `nuxt.config.ts` and add `'@lacqjs/nuxt-dict'` to the `modules` array:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
    '@lacqjs/nuxt-dict'
  ],
})
```

> **What is `modules`?** Nuxt's module system allows others to package a feature — you just register it in `modules` and it works. Like installing + enabling an App on your phone.

Save the file. If `pnpm dev` is still running, Nuxt will automatically detect the change and reload.

## Step 3: Verify the installation

### Check console logs

Restart the dev server:

```bash
pnpm dev
```

In the terminal, you should see logs like:

```
[nuxt-dict] Initializing module @lacqjs/nuxt-dict
[nuxt-dict] Module options: { enable: true, logLevel: 3, ... }
```

### Verify TypeScript support

In your `pages/index.vue`, enter:

```vue [pages/index.vue]
<script setup lang="ts">
const { data } = useDict('gender')
</script>
```

If your editor shows no errors and `useDict` has auto-completion, TypeScript type declarations are loaded correctly.

> **Why does it work without `dict: {}` configuration?** All module options have sensible defaults. See [Full Config Reference](/advanced/full-config) for details.

## What You Learned

- [ ] Install the module with `pnpm add @lacqjs/nuxt-dict`
- [ ] Register the module in `nuxt.config.ts`
- [ ] Verify via console logs
- [ ] Confirm TypeScript type hints work
