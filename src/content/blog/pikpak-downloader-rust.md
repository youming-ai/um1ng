---
title: 'PikPak 高性能下载器：Rust 重写私有 API 的验证码与 Token 轮转'
excerpt: '把 PikPak 私有 Android API 用 Rust 重写：9-salt 链式 MD5 验证码、OAuth 自动轮转、断点续传与并发下载。★18 背后的工程细节。'
publishDate: 'Aug 19 2026'
tags:
  - Rust
  - DevTools
  - PikPak
seo:
  image:
    src: '/post-1.jpg'
    alt: 'PikPak Downloader Rust'
---

![PikPak Downloader](/post-1.jpg)

> **Repo:** [youming-ai/pikpak-downloader](https://github.com/youming-ai/pikpak-downloader) · **Stars:** ★18 · **Crates:** `pikpak` lib + `pikpak` bin

PikPak 没有开放 API，官方客户端走私有 Android 接口。`pikpak-downloader` 把这套接口用 Rust 重写，做成 CLI + 可嵌入库，解决批量备份的三大痛点：验证码、Token 过期、递归下载。

## 为什么重写

Go 版 `pikpakcli` 已有 MD5 逻辑，但缺少库化、断点续传与并发控制。Rust 版本目标是**单二进制分发 + 库级别复用**，`cargo build --release` 直接得到 `pikpak`，也可 `pikpak::Client::builder().build()` 嵌入自有服务。

## 验证码：9-salt 链式 MD5

PikPak 要求 `X-Captcha-Token: 1.<hex>`，由 9 个 salt `hex(md5(prev+salt))` 链式计算，对应 `GET:/drive/v1/*` 每个 action。实现上 `CaptchaManager` 按 action 缓存 30 分钟，遇 `error_code 9` 自动刷新重试。逆向来源已在 `src/captcha.rs` 注释，兼容 Android 包名 `com.pikcloud.pikpak/1.21.0` 的 `init` 上报。

## Token 轮转

`src/auth.rs:TokenManager` 用 `Arc<RwLock<CachedToken>>`，60s 提前量过期，`POST /v1/auth/token` 带 `YNxT9w7GMdWvEOKa` 固定 client 凭证。`refresh_token` 轮转后自动写回 `.env`（或打印提示），`device_id` 缺省时取 `md5(refresh_token)` 保证稳定。401 触发一次 `invalidate + retry`，避免并发下的重复刷新。

## 下载管线

```rust
// 伪代码
list_folder(page_token 循环, 500/页, 无限循环保护)
  → 递归建目录（预创建避免并发 mkdir 竞态）
  → Semaphore 控制 --jobs
  → download_file: .part 原子写入 + Range 续传 + 5 次指数退避
```

`safe_component()` 过滤 `..` 与路径分隔符，`humansize::BINARY` 人性化展示。`proxy` 与 `User-Agent` 可配，超时可覆盖。

## 使用

```bash
echo "refresh_token=..." > .env
./target/release/pikpak quota          # 总量/已用/剩余
./target/release/pikpak ls --path / --human --long
./target/release/pikpak download --path /MyFolder --output ./downloads --jobs 4
```

作为库：

```rust
let client = pikpak::Client::builder().refresh_token(token).build()?;
let quota = client.quota().await?;
client.list_folder("/").await?;
```

**取舍：** 纯 Rust + `reqwest/rustls` 无 OpenSSL 依赖，LTO + strip 后单文件 ~5MB，适合 NAS 与 CI 批量跑。

项目页：[/projects/pikpak-downloader](/projects/pikpak-downloader)
