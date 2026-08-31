---
title: 'Bun TS Stack Skills — 全栈 Cloudflare 技能包'
description: 'Claude Skill：Bun + TanStack Start + Cloudflare Workers + D1/KV/R2 + Better Auth 的全量约定与脚手架。'
publishDate: 'Aug 24 2026'
seo:
  image:
    src: '/project-2.jpg'
    alt: 'Bun TS Stack Skills'
---

![Bun TS Stack Skills](/project-2.jpg)

> **Repo:** [youming-ai/bun-ts-stack-skills](https://github.com/youming-ai/bun-ts-stack-skills) · **Artifact:** `dist/tanstack.skill` (zip) · **Stack:** TanStack Start · Cloudflare Workers · Drizzle

面向 Claude 的“All-in-Cloudflare” TypeScript 技能包。单一可信源 `tanstack/SKILL.md`（33KB / 742 行）描述脚手架、预配、迁移与集成范式，`build.sh → dist/tanstack.skill` 打包后上传到 Claude 技能设置，按关键词自动触发（“scaffold project / add auth / send emails / upload files / Drizzle schema / deploy to Cloudflare”）。

## 核心内容

- **不可协商约定：** 仅 Bun（禁 npm/pnpm/node）、仅 Workers 运行时（Web API，无 `Bun.*`/`bun:sqlite`）、绑定请求时获取（`env.DB` handler 内）、严格 TS、Vitest 经 workerd 而非 `bun test`
- **架构双模：** SSG（预渲染 → CDN）vs SSR（Worker → D1/KV/Mail/Queues/AI）；CRUD 经 `createServerFn`，webhooks/文件经 `src/routes/api/*.ts`
- **预配与迁移：** `wrangler d1 create` / `kv namespace create` / `email sending enable` → `drizzle-kit generate` + `wrangler d1 migrations apply` + `wrangler types`；含 D1 Drizzle、Postgres+Hyperdrive 4 步切换、Better Auth (Drizzle adapter + KV 二级存储 + rateLimit)、Zod 共享 schema
- **按需扩展表：** Vectorize (RAG)、Queues/Workflows、Durable Objects (hibernation WS)、Turnstile、R2、ratelimits、Secrets Store、VPC 等可插拔

## 产出

```bash
./build.sh  # → dist/tanstack.skill
```

仓库本身即文档与分发物，无 `package.json`，MIT。适合作为个人全栈脚手架的“元项目”，集中体现 Cloudflare 全家桶的工程化经验。
