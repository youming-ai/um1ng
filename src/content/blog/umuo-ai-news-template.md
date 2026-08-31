---
title: 'Umuo：15 分钟轮询 31 源的 AI 新闻模板'
excerpt: 'Astro 7 + D1 + KV SWR：Cron 扇出 31 源、fingerprint 去重、LLM 8篇/批富化，瀑布流无限滚动。'
publishDate: 'Aug 22 2026'
tags:
  - AI
  - Astro
  - Cloudflare
  - D1
seo:
  image:
    src: '/post-6.jpg'
    alt: 'Umuo AI News'
---

![Umuo](/post-6.jpg)

> **Repo:** [youming-ai/umuo](https://github.com/youming-ai/umuo) · **Live:** [umuo.app](https://umuo.app) · `wrangler.toml` + `worker/entrypoint.ts`

原为足球新闻站，现泛化为“fork 即用”模板。Cron 每 15 分钟扇出 **31 源**（5 全局 RSS + 12 联赛 RSS + 14 ESPN api-json），按 `fingerprint+归一化标题` 去重，LLM 8 篇/批富化后写入 D1。

## 摄入

`*/15 * * * *` → `ingestAllSources` → 去重 → 顺序 LLM (`LLM_BASE_URL=https://api.b.ai/v1`, `LLM_MODEL=deepseek-v4-flash`, `wrangler secret put LLM_API_KEY`) → D1 `umuo-content` (APAC, 8 migrations)。保留 `17 3 * * *` 归档 >90d（永不 DELETE，保留 fingerprint 防回灌）。

## 读取：KV SWR

`CACHE` KV (`b5d6927…`) + `runCached` 合并去重 + `x-cache: HIT/MISS/REVALIDATED/STALE`。自由文本 `q` 绕过 KV 直查 D1，keyset 游标 `day_bucket:quality:published_at:id`。`src/competitions.ts` 14 联赛与 `src/feeds/sources.ts` 31 源均为**注册表即代码**。

## 前台与 SEO

Astro 7 SSR `output:server` + React islands + Tailwind 3.4，`ExploreView` 瀑布流无限滚动，路由 `/` `/:comp` `/a/:id` `/rss.xml` `/:comp/rss.xml` `/sitemap.xml` `/sitemap-news.xml` (48h) + canonical/og/JSON-LD + IndexNow，`design-tokens/tokens.json` 主题。

## 成本

约 90 次 LLM 调用/天处理 ~700 篇，免费额度可跑。`bun run deploy` 先迁移再发布，需预创建 D1 与 KV，**不要**加 Durable Objects/Queues（预览会坏）。

项目页：[/projects/umuo](/projects/umuo)
