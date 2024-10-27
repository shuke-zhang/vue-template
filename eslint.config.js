import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
export default [
  {
    // 设置 ECMAScript 版本和模块类型
    languageOptions: {
      ecmaVersion: 2024, // 使用 ECMAScript 2024 标准
      sourceType: 'module', // 指定代码使用 ES 模块化（import 和 export）语法
    },
  },

  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'], // 指定要检查的文件类型，包括 ts、mts、tsx 和 vue 文件
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'], // 列出了需要忽略的文件夹和路径
  },

  // 插件配置
  ...pluginVue.configs['flat/essential'], // 导入 eslint-plugin-vue 插件的基础配置
  ...vueTsEslintConfig(), // 用于支持 TypeScript 和 Vue 的 ESLint 配置
  {
    ...pluginVitest.configs.recommended, // Vitest 测试文件的推荐 ESLint 配置
    files: ['src/**/__tests__/*'], // 应用于 src 目录下的 __tests__ 文件夹中的测试文件
  },

  // 禁用 ESLint 和 Prettier 的冲突规则，确保 Prettier 负责格式化
  skipFormatting,
  {
    rules: {
      'no-unused-vars': 'off', // 是用于检测代码中定义了但未使用的变量的规则。如果启用该规则，当有未使用的变量时，ESLint 会报错或警告。
      'no-undef': 'off', // 用于检测代码中使用了未定义的变量。当在代码中使用了未定义的变量时，ESLint 会抛出错误。
      'vue/multi-word-component-names': 'off', // 允许单词命名组件
      'vue/valid-template-root': 'off', // 禁止 v-model 错误用法的检查
      'vue/valid-v-model': 'off', // 禁止无效的 v-model 检查
      'vue/html-self-closing': [
        // 控制 HTML 标签是否自闭合
        'error',
        {
          html: { void: 'any', normal: 'any', component: 'any' },
          svg: 'any',
          math: 'any',
        },
      ],
    },
  },
];
