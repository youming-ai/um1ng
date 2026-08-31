---
title: 'Shadowing Learning：用 Groq + Dexie 做影子跟读训练器'
excerpt: '音频/YouTube → Whisper 转写 → LLM 分块精加工 → Dexie 落库 → 统一播放器跟读循环。离线优先的架构。'
publishDate: 'Aug 21 2026'
tags:
  - AI
  - Learning
  - Cloudflare
  - Groq
seo:
  image:
    src: '/post-5.jpg'
    alt: 'Shadowing Learning'
---

![Shadowing Learning](/post-5.jpg)

> **Repo:** [youming-ai/shadowing-learning](https://github.com/youming-ai/shadowing-learning) · **Stack:** Bun + Vite 8 + Workers + Groq + Dexie

影子跟读（shadowing）需要“带时间轴的字幕 + 跟读循环 + 录音对比”。`shadowing-learning` 把全流程跑通，且**无后端数据库**——媒体/字幕/分段全在浏览器 IndexedDB (Dexie 4.4)。

## 双路摄入

- **音频** `POST /api/transcribe`：Groq `Whisper-large-v3-turbo`，25MB/10req/min。
- **YouTube** `POST /api/youtube/resolve|captions`：`youtubei.js 17.2` 拉官方字幕轨，20req/10min，无字幕记 `NO_CAPTIONS`（Workers 无法 exec `yt-dlp`，不做回退）。

## 分块精加工

`runChunkedPostProcess` 每批 ≤100 段/≤10k 字符调 `POST /api/postprocess` (`openai/gpt-oss-120b` via Groq)，`TOO_MANY_SEGMENTS` 守卫，增量落库。`useTranscription` (音频) 与 `useSubtitlePipeline` (YouTube 自动驱动、断点续跑) 分别编排。`DBUtils` 事务先删子表再删父表。

## 播放器

统一适配器：`AudioFileAdapter` (Blob URL + WeakMap + revoke) 与 `YouTubeAdapter` (IFrame 250ms 轮询) 同一接口，上层 `shadowing-machine` + 二分查找 `active-segment/word`，hooks `useShadowingPractice/useSegmentLoop/useSegmentNavigation/useSentenceRecorder`。

## 其他

- 5 语言独立切换 (zh-CN/zh-TW/en/ja/ko) 分别作用 UI/转写/翻译
- 4 主题 (dark/light/system/high-contrast) via CSS vars `data-theme`
- `RATE_LIMIT_KV` 可选滑动窗口，`apiSuccess/apiError` 信封，`withRetry 3×1s×2≤30s` 跳过 4xx

> 一个 Workers 同时服务 `/api/*` + SPA，需 `wrangler secret put GROQ_API_KEY`。无鉴权、免费额度友好，适合个人跟读。

项目页：[/projects/shadowing-learning](/projects/shadowing-learning)
