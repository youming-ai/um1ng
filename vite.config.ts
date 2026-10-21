import tailwindcss from '@tailwindcss/vite';
import { voidPlugin } from 'void';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [tailwindcss(), voidPlugin()],
    // Allow for the three.js renderer bundle.
    build: { chunkSizeWarningLimit: 700 }
});
