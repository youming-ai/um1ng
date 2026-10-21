# um1ng

[um1ng.me](https://um1ng.me) · 个人主页，跟随鼠标转动的线框与粒子骷髅头。

[Void](https://void.cloud)（Vite）· 原生 WebGL · Cloudflare Workers，无运行时依赖。

## 使用

需要 Bun 和 Node.js 22+。

```sh
bun install
bun dev          # 本地开发
bun run build    # 构建到 dist/client
bun preview      # 预览构建结果
bun run deploy   # 上传 dist/client（不会重新构建）
```

Cloudflare Workers Builds：构建命令 `bun run build`，部署命令 `bun run deploy`。Worker、域名和访问设置在 `void.config.ts`。

## 结构

```text
public/
├── skull.bin          # 骷髅头模型（由 scripts/skull.mjs 生成）
├── favicon.svg
└── robots.txt
scripts/
├── skull.obj          # 模型源文件
└── skull.mjs          # node scripts/skull.mjs scripts/skull.obj public/skull.bin
index.html             # 首页、样式与社交链接（字体来自 Google Fonts，按页脚文字子集化）
src/main.ts            # WebGL 场景与交互
void.config.ts         # 静态部署与 Cloudflare 设置
```

## 署名

模型：[Human Skull](https://opengameart.org/content/human-skull-0)，CDmir，CC0。视觉参考 [pvp.trade](https://pvp.trade/)。代码许可证：[GPL-3.0](LICENSE)。
