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
    subtitle: '',
    description: 'um1ng — projects and blog.',
    image: {
        src: '/dante-preview.jpg',
        alt: 'um1ng'
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
        title: '',
        text: '',
        image: {
            src: '/hero.jpeg',
            alt: 'um1ng'
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
        text: '',
        formUrl: '#'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
