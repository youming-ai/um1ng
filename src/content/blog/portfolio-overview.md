---
title: '我的开源作品集盘点：从 AI 应用到 Web3 终端的 10 个项目'
excerpt: '把散落在 GitHub 的 10+ 项目归类为三条主线：AI 应用（OCR/跟读/实时字幕/AI 新闻）、开发者工具（用量监控/PikPak 下载器/全栈技能包/视频下载）与 Web3 交易终端（Hyperliquid 鲸鱼跟单）。一篇看懂技术栈与选型。'
publishDate: 'Aug 28 2026'
isFeatured: true
tags:
  - Portfolio
  - AI
  - Web3
  - DevTools
seo:
  image:
    src: '/post-8.jpg'
    alt: 'Portfolio overview'
---

![Portfolio overview](/post-8.jpg)

过去一年在 [youming-ai](https://github.com/youming-ai) 陆续做了 10+ 开源项目，散落在不同 repo 里。这篇把它们按三条主线归类，方便以后在 [um1ng.com](/) 与简历中直接引用，也记录一下技术选型。

> 完整项目卡片见 [/projects](/projects)，每个项目页都有 repo 链接、功能与技术栈。

## 一览

| 方向 | 项目 | 一句话 | Stars | 栈 |
|------|------|--------|-------|-----|
| **AI 应用** | [OCR](https://github.com/youming-ai/ocr) | 浏览器端 PaddleOCR，零外发 | ★9 | Vite + ONNX WASM + Workers |
| | [shadowing-learning](https://github.com/youming-ai/shadowing-learning) | 音频/YouTube → 跟读训练 | — | Bun + Workers + Groq + Dexie |
| | [zooom](https://github.com/youming-ai/zooom) | LiveKit 实时中日字幕 | — | LiveKit + Deepgram + Gemini |
| | [umuo](https://github.com/youming-ai/umuo) | AI 精选新闻模板 | — | Astro 7 + D1 + KV |
| **开发者工具** | [agent-usage-monitor](https://github.com/youming-ai/agent-usage-monitor) | Claude/Codex 用量 TUI | ★2 | Rust + ratatui |
| | [pikpak-downloader](https://github.com/youming-ai/pikpak-downloader) | PikPak 高性能下载器 | ★**18** | Rust + Tokio |
| | [snatch](https://github.com/youming-ai/snatch) | 全网视频下载 (yt-dlp) | — | Bun + Hono + Docker |
| | [bun-ts-stack-skills](https://github.com/youming-ai/bun-ts-stack-skills) | All-in-Cloudflare 技能包 | — | Skill (Markdown) |
| **Web3** | [HyperDash](https://github.com/youming-ai/Hyperliquid-Whale-Tracker) | Hyperliquid 鲸鱼跟单终端 | ★4 | Turborepo + Workers + Go |
| | [Nexus](https://github.com/youming-ai/Nexus) | Next.js 全栈启动模板 | ★3 | Next.js 15 + Supabase + Prisma |

---

## 1) AI 应用 — 让模型跑在离用户最近的地方

### OCR — 隐私优先的浏览器 OCR

[Pikpak 是下载，OCR 是识别] — 用户最在意的是“我的文件会不会被上传”。OCR 把 PaddleOCR PP-OCRv6-small 完整搬进浏览器 WASM：IndexedDB 缓存模型、32 倍数对齐的 DBNet 预处理、CTC 解码全在本地。[ocr.um1ng.me](https://ocr.um1ng.me) 已上线，适合发票、证件等敏感场景。

**选型：** ONNX Runtime Web 而非 Tesseract.js，精度与速度更好；Cloudflare Workers 仅作静态托管与 `/health`，零后端存储。

### shadowing-learning — 影子跟读

导入 MP3 或 YouTube 链接 → Groq Whisper-large-v3-turbo 转写 → `openai/gpt-oss-120b` 分块精加工（≤100 段/10k 字符一批）→ Dexie 落库 → 统一播放器（`AudioFileAdapter` / `YouTubeAdapter`）做跟读循环、变速与录音对比。关键是**分块 + 增量落库 + 断点续跑**，避免一次 LLM 超限。

### zooom — 实时双语字幕

每人用自己设备进 LiveKit 房间，声明语种后发布音频；Python `livekit-agents` 按音轨起 Deepgram nova-3 流 → Gemini 翻译 → DataChannel `captions` 广播。interim 灰色预览、final 定版，按说话人稳定着色。轻量但完整，适合中日小团队会议。

### umuo — AI 新闻模板

从足球新闻站泛化为“fork 即用”模板：Cron 每 15 分钟扇出 31 源 → fingerprint 去重 → LLM 8 篇/批富化 → D1；KV SWR + 合并去重，前台 Astro 瀑布流无限滚动。`LLM_BASE_URL` 兼容任意 OpenAI 接口，免费额度约 90 次调用/天处理 700 篇，已在 [umuo.app](https://umuo.app) 生产运行。

---

## 2) 开发者工具 — 提效与可观测性

### agent-usage-monitor (aum)

Rust 单二进制，同时读 Claude Code 与 Codex 的本地 JSONL 日志，叠加 OAuth live quota（5h/7d 窗口）、GitHub 风格热力图与 `aum stats` JSON。还暴露 MCP (6 tools + 2 resources) 供 Claude Code 直接查询。特点是**零 API key 统计 + Registry 一行扩展新平台**，`notify 50ms + 5s 轮询` 的增量 watcher 保证不丢事件。

### pikpak-downloader — ★18 最受欢迎

对 PikPak 私有 Android API 的 Rust 封装。亮点是**验证码与 Token 的自动轮转**：9-salt 链式 MD5 的 `X-Captcha-Token` 与 `refresh_token` 自动写回 `.env`。提供 `quota/ls/download` 三件套，`.part` 原子写入 + `Range` 续传，`--jobs` 并发下载并保持目录树。

### snatch — yt-dlp 的薄封装

`POST /resolve → SSE /progress → GET /download` 三段式，`validateUrl` 拒私有网段，`ensureYtDlp` 自举二进制，`ffmpeg` 必需。两段式 Docker 一键起，适合自托管 VPS（需 `child_process`，跑不了 Workers）。

### bun-ts-stack-skills — 技能包

把我在 Cloudflare 全家桶的约定沉淀为 Claude Skill：`tanstack/SKILL.md` 742 行，涵盖 Bun + TanStack Start + Workers + D1/KV/R2 + Better Auth + Drizzle + Tailwind v4。`build.sh → dist/tanstack.skill`，关键词自动触发脚手架与集成。

---

## 3) Web3 — 交易终端

### HyperDash — Hyperliquid 鲸鱼跟单

最重的项目：Turborepo + Bun + Go 三平面。**Web Worker** (TanStack Start + Hono) 做 Terminal/Analytics/Traders/Strategies；**Ingest 平面** 分片 WS（2×12 币，13 订阅/连接限流）→ Redis → Postgres + `/feed/history/*`；**Go Copy Engine** 消费 Redis 队列执行跟单，带杠杆/仓位/滑点/最小下单等风控。亮点是**无种子自动发现**：按 taker 量排序自动摄入鲸鱼档案。

### Nexus

Next.js 15 + Supabase + Prisma + Tailwind v4 的轻量启动模板，作为 HyperDash 这类重型项目的“第二天就上线”替代。

---

## 技术雷达

- **运行时：** 能跑在 Cloudflare Workers 的优先跑 Workers（OCR / shadowing / umuo / HyperDash Web），需要长连接或子进程的用 Bun/Go 常驻（HyperDash Ingest/Copy Engine、snatch）。
- **语言：** 交互与 IO 密集用 TypeScript/Bun，性能与分发用 Rust（aum、pikpak）。
- **数据：** D1 (SQLite) + KV SWR 适合读多写少的 CMS 类（umuo），Postgres + Redis 适合实时交易类（HyperDash）。
- **AI：** 浏览器 WASM (OCR) vs 云端 Groq/Deepgram/Gemini (shadowing/zooom/umuo) 按隐私与延迟权衡。

---

## 下一步

- 给 HyperDash 补全 `apps/api` + `apps/ingest` 对 `api-gateway` 的替代，收敛到纯 Workers + 常驻两平面
- 为 aum 增加更多平台（按 Registry 一行一个）
- umuo 模板增加更多垂直领域 preset（科技/财经）

所有项目 MIT 开源，欢迎 star / issue / PR：[github.com/youming-ai](https://github.com/youming-ai)。
