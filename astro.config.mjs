import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { voidPlugin } from 'void';

// The page is prerendered; the adapter only exists so `void deploy` has a Worker to ship.
export default defineConfig({
    site: 'https://um1ng.com',
    adapter: cloudflare({ configPath: './.void-wrangler.jsonc' }),
    vite: {
        plugins: [tailwindcss(), voidPlugin()],
        // ponytail: three.js (WebGLRenderer) alone is ~550 kB min / ~135 kB gzip and can't be tree-shaken further.
        build: { chunkSizeWarningLimit: 700 }
    }
});
