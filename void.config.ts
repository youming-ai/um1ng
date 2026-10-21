import { defineConfig } from 'void/config';

export default defineConfig({
    cloudflare: {
        // Same Worker name as before, so the um1ng.com custom domain stays attached.
        name: 'um1ng',
        compatibility_date: '2026-10-01',
        compatibility_flags: ['nodejs_als']
    }
});
