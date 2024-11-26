import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      dts: './types/auto-imports.d.ts', // 指定生成的自动导入声明文件的路径
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: 'types/components.d.ts', // 指定生成的组件声明文件的路径
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
