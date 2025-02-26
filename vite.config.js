import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8000,
    proxy: {
      '/ws': {
        target: 'wss://api.leafresh.shop/ws', // WebSocket 서버가 작동하는 주소
        ws: false, // WebSocket 지원
      },
    },
  },
  define: {
    'global': 'window', // 브라우저 환경에서 global을 window로 정의
  },
});