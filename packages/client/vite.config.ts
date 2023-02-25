import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuejsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  define: {
    __VUE_PROD_DEVTOOLS__: true
  },
  build: {
    outDir: '../cli/dist/view'
    // watch: {
    //   include: './package/client/**'
    // }
  },
  plugins: [
    vue(),
    vuejsx(),
  ]
});
