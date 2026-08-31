---
title: 'Zooom：LiveKit + Deepgram + Gemini 实时双语字幕'
excerpt: '每人独立 STT 轨、interim 预览、DataChannel 广播，按说话人着色。Python livekit-agents 的极简实现。'
publishDate: 'Aug 23 2026'
tags:
  - AI
  - LiveKit
  - Realtime
seo:
  image:
    src: '/post-7.jpg'
    alt: 'Zooom LiveKit'
---

![Zooom](/post-7.jpg)

> **Repo:** [youming-ai/zooom](https://github.com/youming-ai/zooom) · `web/` TanStack Start + `agent/` Python

每人用自己设备进 LiveKit 房间，声明语种 (zh/ja) 后发布音频；Python agent 按音轨订阅 → Deepgram `nova-3` 流式 STT (interim+final) → Gemini `2.5-flash` 翻译 → DataChannel `captions` 广播，前端按 participant identity 稳定着色。

## 流程

`JWT(spoken_lang)` → `livekit-client 2.19` 发布 mic → `livekit-agents 1.6` + `livekit-plugins-deepgram 1.6` 逐轨 `nova-3` → `google-genai 2.8` 翻译 → `publish_data(topic=captions)` → `CaptionList` 分组渲染。interim 灰色预览，final 定版。

## 栈

`web` TanStack Start RC + Vite 8 + React 19 + shadcn + `@base-ui/react` + Tailwind v4（`livekit` 单独 chunk ~522KB）；`agent` Python 3.12；LiveKit Cloud 信令；`docker-compose.yml` 单服务 `transcriber` (`restart: unless-stopped`)。

## 局限

固定中日双向、语种加入时确定不可中途切换、无字幕开关与历史持久化（仅 React 内存）。对比 Zoom 原生字幕，属于**轻量原型**，适合 2-8 人小团队双语会。

项目页：[/projects/zooom](/projects/zooom)
