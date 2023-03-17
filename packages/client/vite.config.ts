import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuejsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  define: {
    __VUE_PROD_DEVTOOLS__: true
  },
  build: {
    outDir: '../cli/dist/view',
    sourcemap: true
  },
  plugins: [
    vue(),
    vuejsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]
});
