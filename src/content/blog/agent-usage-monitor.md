---
title: 'Agent Usage Monitor：Rust TUI 实时看 Claude/Codex 烧了多少钱'
excerpt: '单二进制 aum：读本地 JSONL、无需 API key，看 live quota、热力图与 MCP。notify + sliding window 的实时方案。'
publishDate: 'Aug 20 2026'
tags:
  - Rust
  - TUI
  - DevTools
  - MCP
seo:
  image:
    src: '/post-4.jpg'
    alt: 'Agent Usage Monitor TUI'
---

![Agent Usage Monitor](/post-4.jpg)

> **Repo:** [youming-ai/agent-usage-monitor](https://github.com/youming-ai/agent-usage-monitor) · **v1.10.1** · `curl ... | sh` + minisign 验签

`aum` 不调官方计费 API，而是读你本机已落盘的 `~/.claude/projects/**/*.jsonl` 与 `~/.codex/sessions/**/rollout-*.jsonl`，叠加本地 OAuth 凭证去拉 `api.anthropic.com/api/oauth/usage` 的 live quota。

## TUI

`ratatui 0.30 + crossterm`，垂直堆叠等高面板，无标签切换。平台主色写死在 `platforms.rs:primary_color`（Claude 橙 / Codex 蓝），5h/7d 额度窗口、Token 活跃度、GitHub 风格周热力图（周一为首、占满宽度、方块 vs 圆点）。`250ms tick` + `RwLock::try_read` 跳帧避免卡死。

## 实时

`notify 8 + notify-debouncer-full 50ms + 5s 轮询兜底`，`WatcherMessage::Event` 经 `tokio mpsc` → `spawn_blocking` 增量 reader（游标/byte offset）→ `AppState(RwLock)`。`ThreadedRodeo` 字符串驻留 + `CompactDate` + FNV-1a `RecordId` 去重，`max_records 20k` 滑动窗口仅影响 TUI，`aum stats` 拉全量。

## CLI & MCP

```bash
aum --refresh 5
aum stats --pretty --since 2026-08-01 --include-quota
aum mcp   # stdio JSON-RPC，Claude Code 侧配 .mcp.json
aum update --dry-run  # ureq + tar/flate2 + minisign-verify 原子 rename
```

`aum mcp` 暴露 6 tools (`get_daily_stats/get_model_usage/get_cost_breakdown/get_file_operations/get_session_stats/get_quota`) + 2 resources (`aum://summary`, `aum://platforms`)，`rmcp 1.4` 实现。

## 扩展

加平台只需 `platforms::REGISTRY` 一行 + `UsageSource` trait 实现，`main.rs` 零改动。1.10.1 刚删掉 Groq 平台，聚焦 Claude/Codex。

项目页：[/projects/agent-usage-monitor](/projects/agent-usage-monitor)
