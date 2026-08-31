---
title: 'Shadowing Learning — AI 影子跟读训练器'
description: '导入音频或 YouTube 自动生成时间轴字幕，Groq Whisper + LLM 分块精加工，支持跟读循环与录音对比。'
publishDate: 'Aug 25 2026'
seo:
  image:
    src: '/project-5.jpg'
    alt: 'Shadowing Learning'
---

![Shadowing Learning](/project-5.jpg)

> **Repo:** [youming-ai/shadowing-learning](https://github.com/youming-ai/shadowing-learning) · **Stack:** Bun · Vite 8 · React 19 · Cloudflare Workers · Groq · Dexie

AI 驱动的影子跟读（shadowing）训练器。导入 MP3/WAV/M4A/FLAC 或 YouTube URL，自动获得时间轴字幕与分句精加工，进而做跟读循环、变速、逐词高亮与麦克风录音对比。离线优先：媒体/字幕/分段全在浏览器 IndexedDB (Dexie v4)。

## 核心功能

- **双路摄入：** 音频 `POST /api/transcribe` (Groq Whisper-large-v3-turbo, 25MB/10req/min)；YouTube `POST /api/youtube/resolve|captions` (youtubei.js 官方字幕，20req/10min)，无字幕记为 `NO_CAPTIONS` 错误
- **分块精加工：** `runChunkedPostProcess` 每批 ≤100 段/≤10k 字符调 `POST /api/postprocess` (`openai/gpt-oss-120b`)，增量落库，`useTranscription` / `useSubtitlePipeline` 自动驱动与断点续跑
- **统一播放器：** `AudioFileAdapter` (Blob URL + WeakMap) 与 `YouTubeAdapter` (IFrame 250ms 轮询) 统一接口，`shadowing-machine` + 二分查找 `active-segment/word`，`useShadowingPractice`/`useSegmentLoop`/`useSentenceRecorder`
- **本地化与主题：** 5 语言独立切换（zh-CN/zh-TW/en/ja/ko）分别作用于 UI/转写/翻译；4 主题 (dark/light/system/high-contrast) via CSS vars

## 技术栈

Bun 1.2 · Vite 8 SPA · React 19 · TanStack Router/Query · Radix + Tailwind v4 · Dexie 4.4 · Hono 4 + Groq SDK + youtubei.js · Cloudflare Workers (Hono + `ASSETS` SPA fallback) + 可选 `RATE_LIMIT_KV` 滑动窗口

## 本地开发

```bash
bun install
bun run dev   # 双进程：Vite SPA + wrangler dev :8787
wrangler secret put GROQ_API_KEY
```
