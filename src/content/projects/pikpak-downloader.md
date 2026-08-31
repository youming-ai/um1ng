---
title: 'PikPak Downloader — 高性能 Rust 下载器'
description: 'Rust 实现的 PikPak 云盘 CLI + 库，支持递归下载、断点续传、自动验证码与 Token 轮转，★18 最受欢迎开源项目。'
publishDate: 'Aug 21 2026'
isFeatured: true
seo:
  image:
    src: '/project-1.jpg'
    alt: 'PikPak Downloader'
---

![PikPak Downloader](/project-1.jpg)

> **Repo:** [youming-ai/pikpak-downloader](https://github.com/youming-ai/pikpak-downloader) · **Stars:** ★18 · **Stack:** Rust · Tokio · reqwest · clap

PikPak 私有 Android API 的高性能 Rust 封装，提供 CLI 与可嵌入 `pikpak::Client` 库。相比官方客户端，支持递归文件夹下载、断点续传与并发控制，适合批量备份与自动化脚本。

## 核心功能

- **CLI 三件套：** `quota`（容量总览）、`ls --path / --long --human`（分页列目录）、`download --path --output --jobs N`（递归下载并保持目录树）
- **自动验证码：** 9-salt 链式 MD5 → `1.<hex>` 的 `X-Captcha-Token`，按 `GET:/drive/v1/*` action 缓存 30 分钟，遇 `error_code 9` 自动重试
- **OAuth 轮转：** `refresh_token` 自动刷新并写回 `.env`，60s 提前量缓存，401 失效重试一次；`device_id` 由 `md5(refresh_token)` 稳定派生
- **健壮下载：** 原子写入 `.part` + `rename`、`Range` 断点续传、瞬时错误与 5xx/429 指数退避（最多 5 次）、`safe_component()` 防路径穿越
- **代理与定制：** 支持 HTTP/HTTPS 代理、自定义 `User-Agent` 与超时

## 技术栈

Rust 2021 · Tokio (multi-thread) · reqwest (rustls) · clap 4 · serde · tracing · humansize · md-5/hex · release LTO + strip

## 快速开始

```bash
cargo build --release
./target/release/pikpak quota
./target/release/pikpak ls --path / --human
./target/release/pikpak download --path /MyFolder --output ./downloads --jobs 4
```

配置 `.env` 只需一行 `refresh_token=...`，也可作为库 `pikpak::Client::builder().build()` 在你的 Rust 项目中调用 `quota()` / `list_folder()` / `download`。
