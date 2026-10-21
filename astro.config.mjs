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
        // Allow for the three.js renderer bundle.
        build: { chunkSizeWarningLimit: 700 }
    }
});
