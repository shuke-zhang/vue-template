import type { ConfigEnv } from 'vitest/config';

import { fileURLToPath } from 'node:url';

import viteConfig from './vite.config';

import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
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
