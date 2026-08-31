---
title: 'Snatch：yt-dlp 的极简全栈封装——HMAC 签名与 SSE 进度'
excerpt: '粘贴 URL → yt-dlp 探测 → HMAC 选集 → SSE 进度 → 签名下载，1800 站点支持的 Bun + Hono 实现。'
publishDate: 'Aug 24 2026'
tags:
  - Bun
  - Hono
  - yt-dlp
  - DevTools
seo:
  image:
    src: '/post-8.jpg'
    alt: 'Snatch yt-dlp'
---

![Snatch](/post-8.jpg)

> **Repo:** [youming-ai/snatch](https://github.com/youming-ai/snatch) · **Bun 1.3.14** monorepo (shared/api/web) · Docker 一键起

`yt-dlp -J` 能探 1800 站点，但缺签名与进度。`snatch` 补上：`POST /api/resolve` 探 → `GET /api/download/progress` SSE → `GET /api/download` 直送。

## 协议

- **resolve**：`validateUrl()` 拒私有/环回/link-local/单标签（字面量校验，非 DNS 重绑定安全），`ytdlp.ts` 调 `yt-dlp -J` 得可选清晰度，回 HMAC-SHA256 签名的 `progressUrl`。
- **progress**：`GET /api/download/progress` 验签 → `yt-dlp` 执行，`PROGRESS_TEMPLATE` 解析，SSE 推送。
- **download**：`GET /api/download` 验签（时序安全）→ 文件流 + `cleanup` 回调。`GET /health` 直通，`GET /api/info` 探针。

中间件链 `pinoLogger → cors → rateLimit(30/60s, ip)` → `apiKeyAuth`，`hono-pino + zod + @sentry/bun`。

## 引擎自举

`ensureYtDlp`：PATH → `$YTDLP_DIR` 缓存 → GitHub releases 拉二进制，`ffmpeg` 必需。`docker-compose.yml` `app:3001 → 38700`，卷 `ytdlp-cache:/data`。两段式 Docker：`bun:1.3.14 → bun-slim + ffmpeg/ca-certs`，`packages/shared` 零依赖（`SERVICES` 仅 UI 展示，非白名单）。

## 部署

```bash
bun install && bun run build
docker compose up --build  # 38700
```

**注意：** 需 `child_process` + 文件系统，跑不了 Workers/Pages，适合自托管 VPS。

项目页：[/projects/snatch](/projects/snatch)
