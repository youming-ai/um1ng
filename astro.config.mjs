import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { voidPlugin } from 'void';

// The adapter emits the prerendered site under dist/client for static deployment.
export default defineConfig({
    site: 'https://um1ng.com',
    // No images or sessions on a static page, so skip the IMAGES / SESSION bindings the adapter adds by default.
    session: false,
    adapter: cloudflare({ configPath: './.void-wrangler.jsonc', imageService: 'passthrough' }),
    vite: {
        plugins: [tailwindcss(), voidPlugin()],
        // ponytail: three.js (WebGLRenderer) alone is ~550 kB min / ~135 kB gzip and can't be tree-shaken further.
        build: { chunkSizeWarningLimit: 700 }
    }
});
