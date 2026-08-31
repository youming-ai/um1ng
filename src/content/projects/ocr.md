---
title: 'OCR — 隐私优先的浏览器端 OCR'
description: 'PaddleOCR PP-OCRv6-small 完全在浏览器 WASM 中运行，支持图片与 PDF，零文件外发。Live at ocr.um1ng.me。'
publishDate: 'Aug 25 2026'
isFeatured: true
seo:
  image:
    src: '/project-2.jpg'
    alt: 'OCR preview'
---

![OCR preview](/project-2.jpg)

> **Repo:** [youming-ai/ocr](https://github.com/youming-ai/ocr) · **Stars:** ★9 · **Live:** [ocr.um1ng.me](https://ocr.um1ng.me) · **Stack:** Vite 7 · React · ONNX Runtime Web · Cloudflare Workers

隐私优先的纯前端 OCR 单页应用。上传 PNG/JPEG/WebP/BMP/TIFF 或 PDF，PaddleOCR PP-OCRv6-small 模型在浏览器内通过 ONNX Runtime Web (WASM) 完成检测与识别，文件与结果永不离开设备，后端仅提供健康检查与 SEO 元数据。

## 核心功能

- **全本地推理：** IndexedDB 缓存模型（v3，自动迁移旧 parsify 缓存），WASM 路径按 dev/prod 自动切换，损坏缓存 protobuf 重试
- **完整管线：** `resizeImage`（32 倍数对齐，满足 DBNet）→ CHW Float32 归一化 → det `[1,3,H,W]` → NMS → `cropRegion` → rec → CTC greedy 解码，逐阶段 `OcrProgress` 回调
- **PDF 支持：** 自托管 `pdf.worker.min.mjs`，50 页上限，逐页渲染 + AbortSignal，`renderPdfPages` 流式 OCR/回收，PNG blob URL 生命周期管理
- **稳健字典：** `ppocrv6_dict.txt` 校验 ≥100 行，18708 词条 → 18710 类（含 CTC blank 0 与尾空格），拒绝 SPA 回退 HTML

## 技术栈

Bun 1.4 · Vite 7 (conditional `cloudflare()` plugin) · React · Tailwind v4 · Hono 4 · ONNX Runtime Web · PDF.js · IndexedDB · Cloudflare Workers (assets `dist/client` + SPA fallback) / `Bun.serve` 自托管

## 部署

```bash
bun install
bun run dev        # Vite + Hono :3001 (proxy /api)
bun run build && bun run deploy  # wrangler deploy
```

`postinstall` 自动拷贝 ORT WASM 与 PDF worker 到 `public/`，`wrangler.toml` 一键发布到 `ocr` Worker。
