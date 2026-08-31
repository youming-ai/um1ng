---
title: 'Snatch — 全网视频下载器'
description: '粘贴任意公开 URL，yt-dlp 探测 → HMAC 签名选集 → SSE 进度 → 签名下载，支持 1800+ 站点的全栈下载器。'
publishDate: 'Aug 25 2026'
seo:
  image:
    src: '/project-1.jpg'
    alt: 'Snatch'
---

![Snatch](/project-1.jpg)

> **Repo:** [youming-ai/snatch](https://github.com/youming-ai/snatch) · **Stack:** Bun · Hono · yt-dlp · React 19 · Docker

粘贴任意公开视频 URL，Hono 后端用原生 `yt-dlp -J` 探测 → 返回 HMAC 签名的可选清晰度 → SSE 推送下载进度 → 签名文件直送。`yt-dlp` 覆盖约 1800 站点（`SERVICES` 仅作 UI 展示，非白名单）。

## 核心功能

- **三段式流程：** `POST /api/resolve` → `GET /api/download/progress` (SSE) → `GET /api/download` (HMAC-SHA256 时序安全校验)
- **引擎自举：** `ensureYtDlp` 按 PATH → `$YTDLP_DIR` 缓存 → GitHub releases 自动拉取二进制，依赖 `ffmpeg`
- **安全与限流：** `validateUrl` 拒私有/环回/link-local/单标签；中间件 `pinoLogger → cors → rateLimit(30/60s, ip)` → `apiKeyAuth`；`GET /health` 直通
- **全栈一体：** 两段式 Docker（bun:1.3.14 → bun-slim + ffmpeg），`docker-compose.yml` `app:3001 → 38700`，卷 `ytdlp-cache:/data`，SPA 静态 + API 同端口

## 技术栈

Bun 1.3.14 monorepo (shared/api/web) · Hono 4.7 + hono-pino + zod + @sentry/bun · React 19 + TanStack Router (ssr:false) + Tailwind v4 · Biome + lefthook + `bun test`

## 部署

```bash
bun install && bun run build
docker compose up --build  # 38700 → 3001
```

仅适合自托管 VPS（需 `child_process` + 文件系统，无法跑在 Workers/Pages）。
