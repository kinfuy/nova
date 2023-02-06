import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_PROD_DEVTOOLS__: true
  },
  build: {
    outDir: './dist/view'
  },
  plugins: [vue()]
});
