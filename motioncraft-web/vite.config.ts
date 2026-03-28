import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    vue({
      template: {
        compilerOptions: {
          // 将所有带 motioncraft- 标签的视为自定义元素
          isCustomElement: (tag) => tag.startsWith('motioncraft-'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@react': resolve(__dirname, 'src/react'),
      '@vue': resolve(__dirname, 'src/vue'),
      '@bridge': resolve(__dirname, 'src/bridge'),
      '@core': resolve(__dirname, 'src/core'),
      '@types': resolve(__dirname, 'src/types'),
    },
  },
  server: {
    port: 5173,
    host: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg'],
  },
  worker: {
    format: 'es',
  },
});
