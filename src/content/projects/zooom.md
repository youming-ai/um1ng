---
title: 'Zooom — 实时双语字幕会议'
description: '基于 LiveKit + Deepgram + Gemini 的实时中日双语字幕：每人独立 STT，按说话人着色，DataChannel 广播。'
publishDate: 'Aug 15 2026'
seo:
  image:
    src: '/project-7.jpg'
    alt: 'Zooom'
---

![Zooom](/project-7.jpg)

> **Repo:** [youming-ai/zooom](https://github.com/youming-ai/zooom) · **Stack:** LiveKit · Deepgram nova-3 · Gemini 2.5 Flash · TanStack Start · Python livekit-agents

实时双语会议字幕。每位参会者用自己的设备加入 LiveKit 房间并声明语种（zh/ja），发布麦克风音频；Python agent 按音轨订阅 → Deepgram 流式 STT（nova-3，interim+final）→ Gemini 翻译 → 通过 LiveKit DataChannel (`captions` topic) 广播双语字幕，前端按说话人稳定着色分组。

## 核心功能

- **两步加入：** 选语种 → 输入房间名+昵称 → 签发含 `spoken_lang` 的 JWT；语种在加入时确定
- **逐轨 STT 路由：** 每轨独立 Deepgram 流，interim 灰色预览 → final 定版
- **数据通道广播：** `publish_data` 广播字幕，`speakerColor.ts` 稳定配色，`CaptionList` 按 LiveKit participant identity 分组

## 技术栈

`web/` TanStack Start RC + Vite 8 + React 19 + shadcn + @base-ui/react + livekit-client 2.19 + Tailwind v4（`livekit` 独立 chunk ~522KB）；`agent/` Python 3.12 `livekit-agents 1.6` `livekit-plugins-deepgram 1.6` `google-genai 2.8`；LiveKit Cloud + `docker-compose.yml` 单服务 `transcriber`

## 局限与对比

固定中日双向、语种不可中途切换、无字幕开关与历史持久化/导出（仅 React 内存），定位为 Zoom 轻量原型，适合小团队双语会议。
