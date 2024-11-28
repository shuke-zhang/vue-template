import autoImportConfig from './.eslintrc-auto-import.json' with { type: 'json' };

import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import importPlugin from 'eslint-plugin-import';
import pluginVue from 'eslint-plugin-vue';

export default [
  // ./.eslintrc-auto-import,
  {
    // 设置 ECMAScript 版本和模块类型
    languageOptions: {
      ecmaVersion: 'latest', // 使用 ECMAScript 2024 标准
      sourceType: 'module', // 指定代码使用 ES 模块化（import 和 export）语法
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...autoImportConfig.globals,
        var1: 'writable', // 声明一个可写的全局变量
        ResponseResult: 'readonly', // 声明一个只读的全局变量
        ResponseList: 'readonly',
        ResponseData: 'readonly',
      },
    },
  },

  // 插件配置
  // ...pluginVue.configs[
  //   ('flat/essential', 'flat/strongly-recommended', 'flat/recommended')
  // ], // 导入 eslint-plugin-vue 插件的基础配置
  ...pluginVue.configs['flat/essential'],
  ...pluginVue.configs['flat/strongly-recommended'],
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(), // 用于支持 TypeScript 和 Vue 的 ESLint 配置
  importPlugin.flatConfigs.recommended,
  {
    ...pluginVitest.configs.recommended, // Vitest 测试文件的推荐 ESLint 配置
    files: ['src/**/__tests__/*'], // 应用于 src 目录下的 __tests__ 文件夹中的测试文件
  },

  {
    name: 'app/files-to-lint', // name 只表示名称，不做实际作用
    files: ['**/*.{ts,mts,tsx,vue}'], // 指定要检查的文件类型，包括 ts、mts、tsx 和 vue 文件
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'], // 列出了需要忽略的文件夹和路径
  },

  // 禁用 ESLint 和 Prettier 的冲突规则，确保 Prettier 负责格式化
  skipFormatting,
  {
    settings: {
      'import/resolver': {
        alias: {
          map: [
            // 这里参照别名配置映射
            ['@', './src'],
            ['element-plus', './node_modules/element-plus'],
            ['virtual:uno.css', './node_modules/unocss'],
          ],
          // 告诉resolver-alias有哪些后缀的文件要解析
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
        node: true,
        typescript: true,
      },
    },
  },
  {
    rules: {
      semi: 'error', // 强制要求每一行使用分号
      'no-unused-vars': 'off', // 是用于检测代码中定义了但未使用的变量的规则。如果启用该规则，当有未使用的变量时，ESLint 会报错或警告。
      'no-undef': 'off', // 用于检测代码中使用了未定义的变量。当在代码中使用了未定义的变量时，ESLint 会抛出错误。
      'vue/multi-word-component-names': 'off', // 允许单词命名组件 - 如果开启当使用了一个单词命名组件时会在script标签上报错Component name "eslint" should always be multi-word.
      'vue/attributes-order': 'error',
      'import/no-dynamic-require': 'warn', // require其中的参数不能是变量或表达式，必须是一个静态字符串 require('./someModule')
      'import/no-nodejs-modules': 'off', // 取消Node.js 导入模块的检查  默认不检查 这儿添加只是为了注释
      'import/order': [
        'error', // 表示如果违反规则，将会报错
        {
          groups: [
            ['type'], // 1. 第一个分组：类型声明
            ['object', 'builtin'], // 2. 第二个分组：对象模块和内置模块
            'internal', // 3. 第三个分组：项目内部模块
            'sibling', // 4. 第四个分组：同级模块
            'index', // 5. 第五个分组：当前目录下的索引模块
          ],
          'newlines-between': 'always', // 每个分组之间必须有空行
          alphabetize: {
            order: 'asc', // 按字母升序排列
            caseInsensitive: true, // 排序时不区分大小写
          },
        },
      ],
    },
  },
  {
    // 通过 glob 模式匹配所有的 vite 配置文件
    files: ['vite.config.*'], // 匹配 vite.config.js 和 vite.config.ts
    rules: {
      'import/default': 'off', // 禁用 import/default 规则
    },
  },
];
