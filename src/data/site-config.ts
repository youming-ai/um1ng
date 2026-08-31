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

export type SiteConfig = {
    website: string;
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    website: 'https://um1ng.com',
    title: 'um1ng',
    subtitle: '',
    description: 'um1ng — projects and blog.',
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
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
