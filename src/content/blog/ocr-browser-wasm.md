---
title: '浏览器端 OCR：PaddleOCR WASM 零外发的隐私方案'
excerpt: '把 PaddleOCR PP-OCRv6-small 搬进浏览器：ONNX Runtime Web + IndexedDB 缓存 + 32 对齐预处理，文件永不外发。'
publishDate: 'Aug 20 2026'
tags:
  - AI
  - OCR
  - Privacy
  - WASM
seo:
  image:
    src: '/post-2.jpg'
    alt: 'Browser OCR WASM'
---

![Browser OCR](/post-2.jpg)

> **Repo:** [youming-ai/ocr](https://github.com/youming-ai/ocr) · **Stars:** ★9 · **Live:** [ocr.um1ng.me](https://ocr.um1ng.me)

敏感票据不敢传云端？`ocr` 把 PaddleOCR 完整跑在浏览器里：图片/PDF → WASM 推理 → 文本，零外发。后端只是静态托管与 `/health`。

## 管线 8 步

`src/lib/ocr/pipeline.ts:OcrPipeline`：

1. `loadImage` → 2. `resizeImage`(缩放到 32 倍数，DBNet 要求，小图也对齐，返回 scaleX/scaleY 回映射) → 3. `imageToPixels`(OffscreenCanvas → CHW Float32 归一化) → 4. det Tensor `[1,3,H,W]` → 5. NMS + `extractBoxes/sortBoxes` → 6. `cropRegion + normalizeForRec` → 7. rec 推理 → 8. CTC greedy 解码。每步 `OcrProgress` 回调驱动 UI 进度条。

## 模型与字典

- **缓存：** `model-loader.ts` IndexedDB `ocr-models` v3，自动迁移旧 `parsify-ocr-models`，`fetchModel` 流式进度，WASM 路径 dev→`/node_modules` prod→`/ort`，protobuf 损坏重试。
- **字典：** `character-dict.ts` 校验 `ppocrv6_dict.txt ≥100 行`，18708 词条 → 18710 类（含 CTC blank 0 + 尾空格），拒绝 SPA 回退 HTML。

## PDF

自托管 `pdf.worker.min.mjs`，`DEFAULT_MAX_PAGES 50`，`renderPdfPages` 逐页渲染 + `AbortSignal` + `onPage` 流式 OCR，PNG `blob:` URL 用后 `revoke`，避免内存泄漏。`scan-session.ts:runScanSession` 统一 `AbortController` 取消与 `objectUrl` 生命周期。

## 部署

```bash
bun install
bun run dev        # Vite + Hono :3001
bun run build && bun run deploy  # wrangler → ocr Worker (ASSETS dist/client)
```

`postinstall` 自拷贝 ORT WASM 与 PDF worker 到 `public/`，`wrangler.toml` 一键发布。适合发票、证件等隐私场景，也可 fork 后换字典做多语言。

项目页：[/projects/ocr](/projects/ocr)
