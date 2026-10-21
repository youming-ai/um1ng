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
bunx void deploy --platform cloudflare   # 第一次:浏览器登录并选择账号
bun run deploy                           # 之后
```

Worker 名在 `void.config.ts`(`um1ng`)。

## 目录结构

```text
├── public/models/skull.obj
├── src/
│   ├── pages/index.astro  # 唯一页面,底部 X / GitHub 链接
│   ├── Skull.astro
│   └── styles.css
└── void.config.ts
```
