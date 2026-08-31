---
title: 'Umuo — AI 精选新闻模板 (umuo.app)'
description: 'Astro + Cloudflare Workers 的 AI 新闻站模板：15 分钟轮询 31 源、去重、LLM 富化、KV SWR 与无限滚动。'
publishDate: 'Aug 25 2026'
seo:
  image:
    src: '/project-6.jpg'
    alt: 'Umuo'
---

![Umuo](/project-6.jpg)

> **Repo:** [youming-ai/umuo](https://github.com/youming-ai/umuo) · **Live:** [umuo.app](https://umuo.app) · **Stack:** Astro 7 · Workers · D1 · KV

原为足球新闻站，现已泛化为“fork 即用”的 AI 精选新闻模板。每 15 分钟扇出 31 个源（5 全局 RSS + 12 联赛 RSS + 14 ESPN api-json），按 fingerprint + 归一化标题去重，LLM 按 8 篇/次分块富化后写入 D1，前台 Astro 瀑布流无限滚动。

## 核心功能

- **摄入流水线：** Cron `*/15 * * * *` → `ingestAllSources` → 去重 → 顺序 LLM 8 篇/调用 → D1 `umuo-content`（APAC）；保留 `17 3 * * *` 归档 >90d（永不 DELETE，保留 fingerprint）
- **KV SWR 缓存：** `CACHE` KV + `runCached` 合并去重 + `x-cache: HIT/MISS/REVALIDATED/STALE`，自由文本 `q` 直通绕过 KV；keyset 游标 `day_bucket:quality:published_at:id`
- **路由与 SEO：** `/` `/:comp` `/a/:id` `/rss.xml` `/:comp/rss.xml` `/sitemap.xml` `/sitemap-news.xml` (48h) + canonical/og/JSON-LD + IndexNow；`design-tokens/tokens.json`
- **注册表即代码：** `src/competitions.ts` 14 联赛、`src/feeds/sources.ts` 31 源、`src/site.ts` 品牌/origin 单一来源

## 技术栈

Bun 1.4 · Astro 7 (SSR `output:server` + @astrojs/cloudflare + React islands) · Tailwind 3.4 · workerd · D1 (8 migrations) · KV SWR · Vitest 4 + Biome 2.5 · wrangler.toml + `worker/entrypoint.ts`

## 一键复刻

`LLM_BASE_URL=https://api.b.ai/v1` + `LLM_MODEL=deepseek-v4-flash`，`wrangler secret put LLM_API_KEY` 后 `bun run deploy`（先迁移再发布），免费额度约 90 次 LLM 调用/天处理 ~700 篇。
