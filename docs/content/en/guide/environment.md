---
title: Environment Setup
description: Install Node.js and pnpm, then create your first Nuxt project.
---

**Goal**: Install Node.js and pnpm on your computer, then create a running Nuxt project. By the end of this chapter, you will have a blank Nuxt project accessible at `http://localhost:3000`.

## Step 1: Install Node.js

Node.js is the runtime environment for Nuxt. Nuxt 4 requires **Node.js >= 22.0.0**.

### 1.1 Download

Open the Node.js official website: [https://nodejs.org](https://nodejs.org)

You will see two versions:
- **LTS** (Long Term Support): Recommended for most users, stable and reliable
- **Current**: Includes the latest features, but may have bugs

**Choose the LTS version and click to download.**

### 1.2 Install

After downloading, double-click the installer and keep clicking "Next" to complete the installation.

During installation, there is an option called **"Automatically install the necessary tools"** — check it (it will automatically install some build tools you might need later).

### 1.3 Verify

After installation, open your terminal (PowerShell / CMD / Terminal) and run:

```bash
node --version
```

You should see output similar to:

```
v22.12.0
```

If the version is >= `22.0.0`, the installation was successful.

## Step 2: Install pnpm

pnpm is a JavaScript package manager. Think of it as an "app store" — others publish their code as packages, and you use pnpm to download and install them.

Nuxt Dict requires pnpm; npm or yarn cannot be used.

### 2.1 Install pnpm

Run in your terminal:

```bash
npm install -g pnpm
```

### 2.2 Verify

```bash
pnpm --version
```

The output should be >= `10.22.0`.

### 2.3 Configure Mirror (Optional, Recommended)

If you are in China, accessing the foreign npm registry can be slow. Configure a mirror to speed up downloads:

```bash
pnpm config set registry https://registry.npmmirror.com/
```

## Step 3: Create a Nuxt Project

### 3.1 Initialize

Navigate to the directory where you want to create your project, then run:

```bash
npx nuxi init my-app
```

During setup, it will ask:
- **Which package manager would you like to use?** → Choose **pnpm**
- **Initialize git repository?** → Choose **Yes** (recommended)

### 3.2 Enter the project directory

```bash
cd my-app
```

### 3.3 Install dependencies

```bash
pnpm install
```

### 3.4 Start the project

```bash
pnpm dev
```

You should see:

```
Nuxt 4.x.x

> Local:    http://localhost:3000/
```

Open `http://localhost:3000/` in your browser. If you see the Nuxt welcome page, the project was created successfully!

## What You Learned

- [ ] Install Node.js (version >= 22)
- [ ] Install pnpm package manager
- [ ] Create a Nuxt project with `npx nuxi init`
- [ ] Start the dev server with `pnpm dev`
- [ ] Visit `http://localhost:3000` in your browser
