import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  json: {
    stringify: false,
  },
  build: {
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
