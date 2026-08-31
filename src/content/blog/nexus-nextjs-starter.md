---
title: 'Nexus：Next.js 15 + Supabase + Prisma 的生产级启动模板'
excerpt: '当 HyperDash 太重时，用 Nexus 第二天就上线：Next.js 15 + Supabase Auth + Prisma + Tailwind v4 + shadcn/ui。'
publishDate: 'Aug 27 2026'
tags:
  - Next.js
  - Supabase
  - Prisma
  - Starter
seo:
  image:
    src: '/post-5.jpg'
    alt: 'Nexus starter'
---

![Nexus](/post-5.jpg)

> **Repo:** [youming-ai/Nexus](https://github.com/youming-ai/Nexus) · **Stars:** ★3 · **Stack:** Next.js 15 + Supabase + Prisma + Tailwind v4 + shadcn/ui

HyperDash 是 Turborepo + Workers + Go 的重型方案，很多 SaaS 不需要。`Nexus` 是**轻量全栈起点**：Next.js 15 App Router + Supabase Auth + Prisma ORM + Tailwind v4 + shadcn/ui，约定优于配置。

## 适合

- 后台/营销站/SaaS MVP
- 需要 Supabase 行级鉴权 + Prisma 迁移链路的团队
- 想快速复刻 HyperDash 部分功能但不想上 Turborepo 的场景

## 与其他项目关系

- 比 `bun-ts-stack-skills` 的 Workers 栈更偏传统 Vercel/Supabase 生态
- 比 `umuo` 的 Astro 模板更偏交互与鉴权
- 可作为 `HyperDash` 的“单体版”对照

```bash
git clone https://github.com/youming-ai/Nexus
# 按 README 配 Supabase 与 Prisma 后直接开发
```

项目页：[/projects/nexus](/projects/nexus)
