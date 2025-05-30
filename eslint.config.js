import antfu from '@antfu/eslint-config';

export default antfu({
  ignores: ['node_modules', 'dist', 'README.md'],
  formatters: {
    css: true,
    html: true,
    markdown: true,
    prettierOptions: {
      semi: true, // 确保添加分号
      singleQuote: true, // 使用单引号
      trailingComma: 'es5', // 在对象、数组等末尾添加逗号
    },
  },
  vue: true,
  rules: {
    'no-console': 'off',
    'ts/no-unused-expressions': 'off',
    'vue/custom-event-name-casing': 'off',
    'node/prefer-global/process': 'off',
    // 确保与 Prettier 的分号设置一致
    '@stylistic/semi': ['error', 'always'],
  },
});
