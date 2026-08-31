export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    website: string;
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    website: 'https://um1ng.com',
    title: 'um1ng',
    subtitle: 'youming — Cooking @ elestyle',
    description:
        'youming (um1ng) 的作品集与博客 — AI 应用、开发者工具与 Web3 交易终端。10+ 开源项目，全部开源在 GitHub。',
    image: {
        src: '/dante-preview.jpg',
        alt: 'um1ng — youming portfolio'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Projects',
            href: '/projects'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'GitHub',
            href: 'https://github.com/youming-ai'
        },
        {
            text: 'RSS',
            href: '/rss.xml'
        }
    ],
    socialLinks: [
        {
            text: 'GitHub',
            href: 'https://github.com/youming-ai'
        },
        {
            text: 'X/Twitter',
            href: 'https://x.com/youming_ai'
        }
    ],
    hero: {
        title: 'Hi, I’m youming — building in AI, Web3 & DevTools.',
        text: 'Cooking at <a href="https://github.com/youming-ai" target="_blank" rel="noopener">youming-ai</a> · 10+ 开源项目，涵盖 <strong>AI 应用</strong>（OCR / 跟读 / 实时字幕 / AI 新闻）、<strong>开发者工具</strong>（用量监控 / 下载器 / 全栈技能包）与 <strong>Web3 交易终端</strong>（Hyperliquid 鲸鱼跟单）。全部跑在 Cloudflare / Bun / Rust 上，开箱即用。',
        image: {
            src: '/hero.jpeg',
            alt: 'youming — um1ng'
        },
        actions: [
            {
                text: 'View Projects',
                href: '/projects'
            },
            {
                text: 'GitHub',
                href: 'https://github.com/youming-ai'
            }
        ]
    },
    subscribe: {
        title: 'Subscribe',
        text: '偶尔更新新项目与踩坑笔记。',
        formUrl: '#'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
