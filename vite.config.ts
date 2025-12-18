
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 必須使用相對路徑 base: './' 以支援子目錄佈署
  base: './',
  define: {
    // 注入 Gemini API KEY
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'recharts', 'firebase'],
        },
      },
    },
  },
  esbuild: {
    // 生產環境移除 console 與 debugger
    drop: ['console', 'debugger'],
  },
});
