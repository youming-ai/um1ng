import { voidPlugin } from 'void';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [voidPlugin()],
    // Allow for the three.js renderer bundle.
    build: { chunkSizeWarningLimit: 700 }
});
