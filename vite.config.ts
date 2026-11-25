import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
    host: '127.0.0.1',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.CONTACT_API_TARGET || 'http://127.0.0.1:8080',
        changeOrigin: false,
      },
    },
    fs: {
      strict: true,
    },
  },
  preview: {
    port: Number(process.env.PORT) || 4173,
    strictPort: true,
    host: '127.0.0.1',
    allowedHosts: true,
  },
});
