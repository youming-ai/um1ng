# um1ng

[um1ng.com](https://um1ng.com) — 个人主页：一个跟随鼠标转动的线框 + 粒子骷髅头(three.js),效果参考 [pvp.trade](https://pvp.trade/)。

## 技术栈

- [Astro 7](https://astro.build),单页预渲染
- [Tailwind CSS 4](https://tailwindcss.com)
- [three.js](https://threejs.org):`src/Skull.astro`
- 部署:[Void](https://void.cloud) → Cloudflare Workers

骷髅头模型:[Human Skull](https://opengameart.org/content/human-skull-0) by CDmir,CC0。

## 开发

需要 [Bun](https://bun.sh)。

```sh
bun install
bun dev         # http://localhost:4321
bun run build
bun preview     # 预览构建结果(后台运行,重新 build 后先 `bunx astro preview stop`)
```

## 部署

```sh
bun run build
bun run deploy   # 将 dist/client 静态产物部署到 Cloudflare
```

Worker 名在 `void.config.ts`(`um1ng`)，现有自定义域名为 `um1ng.me`。

Cloudflare Workers Builds 的设置：

- Build command: `bun run build`
- Deploy command: `bunx void deploy --platform cloudflare --dir dist/client`

部署脚本显式指定 Cloudflare 和静态产物目录，避免将预渲染站点当作 Astro Worker 部署。保留 `void.config.ts` 中已有的域名和访问设置。

## 目录结构

```text
├── public/models/skull.obj
├── src/
│   ├── pages/index.astro  # 唯一页面,底部 X / GitHub 链接
│   ├── Skull.astro
│   └── styles.css
└── void.config.ts
```
