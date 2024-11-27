import { fileURLToPath } from 'node:url';

import viteConfig from './vite.config';

import {
  mergeConfig,
  defineConfig,
  configDefaults,
  ConfigEnv,
} from 'vitest/config';
// 假设你需要加载当前的环境变量（你可以根据需要调整）
const mode = process.env.NODE_ENV || 'development';
const viteConfigResult = viteConfig({ mode } as ConfigEnv);
export default mergeConfig(
  viteConfigResult,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
);
