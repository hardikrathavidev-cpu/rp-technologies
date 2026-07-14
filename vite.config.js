import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Same-origin contact API in prod; in dev proxy to local mail server
      '/api/contact': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: () => '/contact.php',
      },
      '/contact.php': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
