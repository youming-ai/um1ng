---
title: 'HyperDash — Hyperliquid 鲸鱼跟单终端'
description: 'Hyperliquid 永续合约的鲸鱼发现 + 跟单平台：实时 WebSocket 分片、鲸鱼自动发现、风险可控的 Go 跟单引擎。'
publishDate: 'Aug 28 2026'
isFeatured: true
seo:
  image:
    src: '/project-3.jpg'
    alt: 'HyperDash preview'
---

![HyperDash preview](/project-3.jpg)

> **Repo:** [youming-ai/Hyperliquid-Whale-Tracker](https://github.com/youming-ai/Hyperliquid-Whale-Tracker) · **Monorepo** Turborepo + Bun + Go · **Live:** Hyperliquid `POST /info` + `wss://api.hyperliquid.xyz/ws`

面向 Hyperliquid 永续合约的鲸鱼情报 + 跟单执行平台。自动按 taker 量发现鲸鱼，摄入其持仓/成交/统计到 Postgres，并让用户以组合或单鲸鱼策略带风控参数镜像跟单。

## 核心功能

- **Trading Terminal (`/terminal`)：** 币种选择（按 24h 量 Top16）、mark/资金费率/OI/24h 量、OrderBook（`book:COIN` 直播）、1m K 线（REST 回补 + `candle:COIN` 直播合并）、TradeFeed、鲸鱼持仓
- **Market Analytics (`/analytics`)：** OI 表、资金费率热力图、价格热力图、压力/类清算热力图、鲸鱼资金流 — 均由 `FeedRecorder` 写入 Redis 的 `/feed/history/*` 驱动
- **Trader Discovery (`/traders`)：** 分页/排序排行榜（pnl/winrate/trades/sharpe/equity，7d/30d/90d/all，`isActive` = 7d 内有交易），单鲸鱼档案、持仓与成交历史
- **跟单策略 (`/strategies`)：** 组合 vs 单鲸鱼，`validateAllocationWeights` 权重和为 1、状态 paused/active/terminated、风控（maxLeverage 1-10、maxPositionUsd、slippageBps 0-100、minOrderUsd、autoRebalance），通过 Redis 队列信号 Go 引擎
- **实时 Feed：** 分片 WS（默认 2 连接 ×12 币，13 订阅/连接、30 连接/分钟限流，按需订阅 book/candle）、频道 `mids`/`ctx`/`trades`/`book`/`candle`/`state` 扇出到浏览器 `/ws`
- **鲸鱼自动发现：** `HL_AUTO_INGEST=1` 按 taker/maker 名义量排序，`HL_INGEST_INTERVAL_MS=600k` 定时全量摄入 Postgres

## 技术栈

Turborepo 2.10 · Bun 1.3 · TanStack Start (Workers @cloudflare/vite-plugin) · Hono 4.12 · Drizzle 0.45 + Hyperdrive · KV · Better Auth SIWE · Wagmi/RainbowKit · Go 1.25 (Gin + pgx + go-redis, Redis Streams) · Postgres 15 · Redis 7 · Biome · Lefthook

## 架构

Web Worker（TanStack Start SSR/CSR + Hono `/api/*`）↔ Ingest 平面（分片 WS → Redis → Postgres + `/feed/*` 历史 + `/jobs/whale-discovery` Cron）↔ Go Copy Engine（消费 Redis CopySignal，风控后下单）。共享 `packages/database` 与 `packages/shared-types`（单一 Hyperliquid 客户端，重试 3 次 + jitter）。
