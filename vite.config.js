import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 讓建置結果可以部署在任何 GitHub Pages 子路徑（/<repo>/）
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
});
