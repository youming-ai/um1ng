import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [tailwindcss()],
    // Allow for the three.js renderer bundle.
    build: { chunkSizeWarningLimit: 700 }
});
