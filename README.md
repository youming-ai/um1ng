# um1ng

[um1ng.me](https://um1ng.me) · 个人主页，跟随鼠标转动的线框与粒子骷髅头。

[Void](https://void.cloud)（Vite）· three.js · Cloudflare Workers。

## 使用

需要 Bun 和 Node.js 22+。

```sh
bun install
bun dev          # 本地开发
bun run build    # 构建到 dist/client（静态资源）和 dist/ssr（Worker）
bun preview      # 预览构建结果
bun run deploy   # void deploy：构建并部署
```

Cloudflare Workers Builds：构建命令 `bun run build`，部署命令 `bun run deploy`。Worker、域名和访问设置在 `void.config.ts`。

## 结构

```text
public/
├── models/skull.obj   # 骷髅头模型
├── geist-pixel.woff2  # 字体（Geist Pixel latin）
├── favicon.svg
└── robots.txt
index.html             # 首页、样式与社交链接
src/
└── main.ts            # three.js 场景与交互
vite.config.ts         # voidPlugin
void.config.ts         # app 类型与 Cloudflare 部署
```

## 署名

模型：[Human Skull](https://opengameart.org/content/human-skull-0)，CDmir，CC0。视觉参考 [pvp.trade](https://pvp.trade/)。代码许可证：[GPL-3.0](LICENSE)。
