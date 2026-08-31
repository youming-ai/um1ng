---
title: 'Bun + Cloudflare 全家桶：从 5 个生产项目沉淀的默认栈'
excerpt: 'Bun + TanStack Start + Workers + D1/KV/R2 + Drizzle + Better Auth 的全量约定，742 行 SKILL.md 即插即用。'
publishDate: 'Aug 25 2026'
tags:
  - Bun
  - Cloudflare
  - TanStack
  - Drizzle
seo:
  image:
    src: '/post-9.jpg'
    alt: 'Bun Cloudflare stack'
---

![Bun Cloudflare stack](/post-9.jpg)

> **Repo:** [youming-ai/bun-ts-stack-skills](https://github.com/youming-ai/bun-ts-stack-skills) · **`dist/tanstack.skill`** (zip) · `tanstack/SKILL.md` 742 行

新项目默认栈收敛到 **Bun + TanStack Start + Cloudflare Workers + D1/KV/R2 + Drizzle + Better Auth + Tailwind v4 + Vitest(workerd)**。散在 OCR/shadowing/umuo/HyperDash 的约定，沉淀为 Claude Skill。

## 不可协商

- **仅 Bun**（禁 npm/pnpm/node），`bun.lock` 单一真相
- **仅 Workers 运行时**（Web API，无 `Bun.*`/`bun:sqlite`）
- **绑定请求时取**：`getDb(env.DB)` 在 handler 内，禁模块级单例
- **Vitest 经 workerd**：`@cloudflare/vitest-pool-workers`，不用 `bun test`

## 双模

- **SSG** 预渲染→CDN（营销/博客）
- **SSR** Worker→D1/KV/Mail/Queues/AI，CRUD 经 `createServerFn`，webhooks/文件经 `src/routes/api/*.ts`

`wrangler d1 create` / `kv namespace create` / `email sending enable` → `drizzle-kit generate` + `wrangler d1 migrations apply` + `wrangler types`。D1 模式与 Postgres+Hyperdrive 4 步切换、Better Auth (Drizzle adapter + KV 二级存储 + rateLimit)、Zod 共享 schema 均在 SKILL.md 给出**可复制片段**。

## 扩展表

Vectorize(RAG)、Queues/Workflows、Durable Objects(hibernation WS)、Turnstile、R2、ratelimits、Secrets Store、VPC 按需勾选，版本 pin `@tanstack/react-start ^1.168`。

```bash
./build.sh  # → dist/tanstack.skill
# 上传到 Claude 技能设置，关键词自动触发：scaffold project / add auth / send emails / upload files / Drizzle schema / deploy to Cloudflare
```

仓库本身即文档，无 `package.json`，MIT。适合作为个人脚手架的“元项目”。

项目页：[/projects/bun-ts-stack-skills](/projects/bun-ts-stack-skills) · 总览：[/blog/portfolio-overview](/blog/portfolio-overview)
