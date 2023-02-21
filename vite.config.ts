import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_PROD_DEVTOOLS__: true
  },
  build: {
    outDir: './dist/view',
    watch: {
      include: './package/client/**'
    }
  },
  plugins: [vue(), Unocss()]
});
