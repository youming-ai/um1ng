# um1ng

[um1ng.com](https://um1ng.com) — 个人项目展示与博客,基于 [Dante](https://github.com/JustGoodUI/dante-astro-theme) 主题(Astro.js + Tailwind CSS)定制。

## 功能

- 暗色 / 亮色模式
- 项目集(Portfolio)与博客,支持标签、分页
- RSS、Sitemap、OpenGraph SEO
- Markdown & MDX

## 技术栈

- [Astro.js 5](https://astro.build) + MDX / RSS / Sitemap
- [Tailwind CSS 4](https://tailwindcss.com)
- 部署:Cloudflare(静态资源,`wrangler.jsonc`)

## 开发

需要 Node >= 20、[pnpm](https://pnpm.io)。

```sh
pnpm install
pnpm dev        # 本地开发 http://localhost:4321
pnpm build      # 构建到 ./dist/
pnpm preview    # 本地预览构建结果
```

## 部署

```sh
pnpm build
npx wrangler deploy
```

## 目录结构

```text
├── public/                  # 静态资源
├── src/
│   ├── components/
│   ├── content/
│   │   ├── blog/            # 博客文章(Markdown)
│   │   ├── projects/        # 项目介绍(Markdown)
│   │   └── pages/           # 独立页面(如 About)
│   ├── data/site-config.ts  # 站点配置(标题、导航、社交链接等)
│   ├── layouts/
│   └── pages/
└── wrangler.jsonc
```

## License

基于 [GPL-3.0](LICENSE) 协议(继承自 Dante 主题)。
