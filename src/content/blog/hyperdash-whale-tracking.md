---
title: 'HyperDash：Hyperliquid 鲸鱼跟单终端的实时架构'
excerpt: 'Turborepo + Workers + Go 三平面：分片 WebSocket、鲸鱼自动发现、Redis 队列驱动的风控跟单。'
publishDate: 'Aug 26 2026'
isFeatured: true
tags:
  - Web3
  - Hyperliquid
  - Trading
  - Cloudflare
seo:
  image:
    src: '/post-3.jpg'
    alt: 'HyperDash Whale Tracker'
---

![HyperDash](/post-3.jpg)

> **Repo:** [youming-ai/Hyperliquid-Whale-Tracker](https://github.com/youming-ai/Hyperliquid-Whale-Tracker) · **Stack:** Turborepo + Bun + TanStack Start + Go

Hyperliquid 永续合约没有“关注鲸鱼”功能。HyperDash 做两件事：**发现鲸鱼**（按 taker 量自动排序）与**跟单执行**（带风控的组合/单鲸鱼策略）。

## 三平面架构

- **Web Worker** (TanStack Start @cloudflare/vite-plugin)：路由 `/terminal` `/analytics` `/traders` `/strategies`，内嵌 Hono `/api/*` (Drizzle+Hyperdrive, KV, Better Auth SIWE)。
- **Ingest 平面** (`apps/ingest` + 旧 `api-gateway` 标注 DEPRECATED 2026-09-30)：分片 WS 客户端（默认 2 连接×12 币，13 订阅/连接、30 连接/分钟限流，按需订阅 book/candle）→ `FeedRecorder` (Redis 历史) + `WhaleDiscovery` (定时 `ingest-traders`) → `FeedWebSocketManager` 扇出 `mids/ctx/trades/book/candle/state` 到浏览器 `/ws`。
- **Copy Engine** (Go 1.25 Gin)：消费 Redis Streams 的 `CopySignal(create/update/delete)`，风控后经 Hyperliquid Adapter 下单。

共享 `packages/database` (单一 Drizzle schema) 与 `packages/shared-types` (带 3 次重试+jitter 的 `hyperliquidRequest`，10s 超时)。

## 页面

- **Terminal**：币种 Top16、mark/资金费率/OI、OrderBook 直播(`book:COIN`)、K线(REST 回补 + `candle:COIN` 直播合并)、TradeFeed、鲸鱼持仓。
- **Analytics**：OI 表、资金费率/价格/压力热力图、鲸鱼资金流，均由 `/feed/history/*` 驱动。
- **Traders**：排行榜（pnl/winrate/trades/sharpe，7d/30d/90d/all，`isActive=7d内有交易`）、持仓/成交分页。
- **Strategies**：`validateAllocationWeights` 权重和=1，状态 paused/active/terminated，风控 `maxLeverage 1-10/slippageBps/minOrderUsd/autoRebalance`。

## 自动发现

`HL_AUTO_INGEST=1` + `HL_INGEST_INTERVAL_MS=600k`，按 taker/maker 名义量排序，`HL_FEED_COINS` 默认 12 (BTC/ETH/SOL... 受 HL 13 订阅限制)，无需手动种子地址。

**坑位：** `api-gateway` 正拆为 `apps/api` (Hono Worker) + `apps/ingest` (WS shard)，目前过渡期双跑；`/heatmap` 曾回空数组已补。

项目页：[/projects/hyperdash](/projects/hyperdash)
