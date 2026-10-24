import { defineConfig } from 'void/config';

export default defineConfig({
    cloudflare: {
        // 仅保留正式域名，避免 workers.dev 和历史版本另开公开入口。
        name: 'um1ng',
        workers_dev: false,
        preview_urls: false,
        routes: [{ pattern: 'um1ng.me', custom_domain: true }],
        compatibility_date: '2026-10-01',
        compatibility_flags: ['nodejs_als']
    }
});
