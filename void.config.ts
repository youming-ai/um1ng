import { defineConfig } from 'void/config';

export default defineConfig({
    // A Void app (voidPlugin in vite.config.ts): Void builds and deploys it, no --dir.
    inference: { appType: 'void' },
    cloudflare: {
        // Preserve the existing Worker's domains and visibility when Void publishes it.
        name: 'um1ng',
        workers_dev: true,
        preview_urls: true,
        // Workers Builds runs `wrangler preview` on non-production branches, which requires this block.
        previews: {},
        routes: [{ pattern: 'um1ng.me', custom_domain: true }],
        compatibility_date: '2026-10-01',
        compatibility_flags: ['nodejs_als']
    }
});
