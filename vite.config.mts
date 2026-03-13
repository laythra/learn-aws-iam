import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), checker({ typescript: true }), nodePolyfills()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          editor: [
            '@uiw/react-codemirror',
            '@codemirror/lang-json',
            '@codemirror/lint',
            '@codemirror/view',
            'ajv',
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['**/node_modules/**', '**/tests/e2e/**'],
    setupFiles: ['./src/lib/array/array.extensions.ts'],
  },
});
