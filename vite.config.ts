
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 使用相對路徑，徹底解決 GitHub Pages 子目錄或重新整理時的白畫面問題
  base: './',
  define: {
    // 注入環境變數，API_KEY 從 GitHub Secrets 取得
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'recharts', 'firebase'],
        },
      },
    },
  },
});
