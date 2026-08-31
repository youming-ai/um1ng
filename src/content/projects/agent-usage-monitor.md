---
title: 'Agent Usage Monitor — Claude & Codex 用量监控'
description: 'Rust 单二进制 TUI：实时读取 Claude Code / Codex 本地日志，叠加 OAuth live quota、热力图与 MCP 服务。'
publishDate: 'Aug 24 2026'
isFeatured: true
seo:
  image:
    src: '/project-4.jpg'
    alt: 'Agent Usage Monitor'
---

![Agent Usage Monitor](/project-4.jpg)

> **Repo:** [youming-ai/agent-usage-monitor](https://github.com/youming-ai/agent-usage-monitor) · **Stars:** ★2 · **Version:** 1.10.1 · **Install:** `curl ... | sh` (minisign 验签)

实时终端仪表盘 + CLI + MCP，读取 `~/.claude/projects/**/*.jsonl` 与 `~/.codex/sessions/**/rollout-*.jsonl` 已落盘日志，无需 API key 即可统计用量；live quota 通过本地 OAuth 凭证直连 `api.anthropic.com` / `chatgpt.com` 获取。

## 核心功能

- **TUI (`aum`)：** 垂直堆叠等高面板、无标签切换、平台主色（Claude 橙 `217,119,87` / Codex 蓝 `59,130,246`）、5h/7d 额度窗口、Token 活跃度、GitHub 风格周热力图（周一为首、占满终端宽度），`q/Esc` 退出，250ms 刷新
- **实时更新：** `notify 8 + debouncer 50ms + 5s 轮询兜底`，按变更路径增量读取，`RwLock::try_read` 跳帧避免阻塞
- **JSON 统计 (`aum stats`)：** `generated_at`、按平台 `totals/models/sessions/dates/quota`、跨平台汇总，支持 `--platform/--since/--until/--include-quota/--compact`
- **MCP 服务 (`aum mcp` stdio)：** 6 tools (`get_daily_stats`/`get_model_usage`/`get_cost_breakdown`/`get_file_operations`/`get_session_stats`/`get_quota`) + 2 resources (`aum://summary`, `aum://platforms`)
- **可扩展 Registry：** `platforms::REGISTRY` 一行新增平台，`UsageSource` trait + 增量游标，`ThreadedRodeo` + `CompactDate` + FNV-1a `RecordId` 去重

## 技术栈

Rust 2024 · tokio · ratatui 0.30 + crossterm · notify · clap 4 · lasso · chrono · ureq/tar/flate2/minisign-verify · rmcp 1.4 · schemars · tracing — 4 架构 tarball (darwin-arm64/amd64, linux-amd64/arm64) via release-please

## 快速开始

```bash
aum                         # TUI
aum stats --pretty --include-quota
aum mcp                     # 供 Claude Code MCP 配置
aum update --dry-run
```
