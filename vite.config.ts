import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // <-- THIS is the correct fix for Vercel
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
