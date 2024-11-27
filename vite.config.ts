import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
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
      imports: ['vue', 'vue-router', 'pinia'],
      dts: './types/auto-imports.d.ts', // 指定生成的自动导入声明文件的路径
      dirs: ['./src/hooks'], // 告诉AutoImport插件在哪些目录中自动导入模块。插件会扫描这些目录中的文件，并根据文件内容自动生成导入语句。
      eslintrc: {
        enabled: true, // 生成 ESLint 配置，避免 import 报错
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // 自动设置全局变量
      },
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      dirs: ['./src/components'],
      dts: './types/components.d.ts', // 指定生成的组件声明文件的路径
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
        ElementPlusResolver(),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
