import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward /contact.php from Vite dev server → local mail server
      '/contact.php': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path, // keep path as-is
      },
    },
  },
});
