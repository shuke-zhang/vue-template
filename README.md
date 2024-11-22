项目搭建-记录
项目使用版本  
node 20.12.2
pnpm 9.12.2
npm 10.9.0

# 项目初始化

一、打开所需要创建的项目文件夹，在命令行中运行以下命令

```js
 pnpm create vue@latest
```

二、选择下面相应的选项

```js
√ 请输入项目名称： ... vue-template
√ 是否使用 TypeScript 语法？ ... 否 / 是√
√ 是否启用 JSX 支持？ ... 否 / 是√
√ 是否引入 Vue Router 进行单页面应用开发？ ... 否 / 是√
√ 是否引入 Pinia 用于状态管理？ ... 否 / 是√
√ 是否引入 Vitest 用于单元测试？ ... 否 / 是√
√ 是否要引入一款端到端（End to End）测试工具？ » 不需要
√ 是否引入 ESLint 用于代码质量检测？ ... 否 / 是√
√ 是否引入 Prettier 用于代码格式化？ ... 否 / 是√
√ 是否引入 Vue DevTools 7 扩展用于调试? (试验阶段) ... 否 / 是√
```

完成上述操作即可实现vue项目的初始化

# eslint / prettierrc 配置 实现代码检查和格式化

> 1. eslint 9.0版本之后配置方式完全变化 官方文档 - https://eslint.org/docs/latest/use/getting-started
> 2. 具体详细配置可参照官方的配置文档 - https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file

##### 配置文件配置 详见 eslint.config.js

###### vue官方 eslint 插件 地址===>https://eslint.vuejs.org/rules/

```js
...pluginVue.configs[

    ('flat/essential', 'flat/strongly-recommended', 'flat/recommended')

]
// 或者
 ...pluginVue.configs['flat/essential'],
  ...pluginVue.configs['flat/strongly-recommended'],
  ...pluginVue.configs['flat/recommended'],
```

一、标签内属性排序规则 vue/attributes-order 配置 官方文档 ===> https://eslint.vuejs.org/rules/attributes-order.html

1.  配置文件中添加 ` ...pluginVue.configs['flat/recommended'],`
2.  官方预设配置中是 waring ，更改为 error 报错 ， rules 中添加 'vue/attributes-order': 'error' 。同时可用下面方式添加自定义属性顺序

    ```node
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT'
        ]
      }
    ]
    ```

3.  目前仅仅发现只支持 vue 文件，对于 tsx 文件中的属性排序目前暂未找到解决方法

二、import 导入排序规则 官方文档 ===> https://github.com/import-js/eslint-plugin-import

1. 插件安装 `pnpm add eslint-plugin-import --save-dev`
2. 引入 `import importPlugin from 'eslint-plugin-import';`
3. 配置插件 `importPlugin.flatConfigs.recommended`
   > 此时在引入时会报错

```vue
import { ref } from 'vue'; // ref not found in 'vue'eslintimport/named import {
data } from './data'; // Unable to resolve path to module
./data.eslintimport/no-unresolved
```

4. 安装插件配置解决报错 `pnpm add eslint-import-resolver-alias --save-dev` , 并在 eslint 配置文件中添加即可解决报错

```js
  {
    settings: {
      'import/resolver': {
        alias: {
          map: [
            // 这里参照别名配置映射
              ['@', './src'],
          ],
          // 告诉resolver-alias有哪些后缀的文件要解析
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      },
    },
  },
```

5. 根据官网提示，rules中添加以下代码，以便于更好约束导入

```js
 'import/no-dynamic-require': 'warn', // require其中的参数不能是变量或表达式，必须是一个静态字符串 require('./someModule')
 'import/no-nodejs-modules': 'off', // 取消Node.js 导入模块的检查  默认不检查 这儿添加只是为了注释
```

> 添加以下代码，防止 import/default检测不要的错误

```js
 {
   // 通过 glob 模式匹配所有的 vite 配置文件 解决 import vueJsx from '@vitejs/plugin-vue-jsx';报错
   files: ['vite.config.*'], // 匹配 vite.config.js 和 vite.config.ts
   rules: {
     'import/default': 'off', // 禁用 import/default 规则
   },
 },
```

6. 更新自动导入顺序排序 import/order

```js
"import/order": [
  "error",  // 表示如果违反规则，将会报错
  {
    "groups": [
      ["type"],                  // 1. 第一个分组：类型声明
      ["object", "builtin"],     // 2. 第二个分组：对象模块和内置模块
      "internal",                // 3. 第三个分组：项目内部模块
      "sibling",                 // 4. 第四个分组：同级模块
      "index"                    // 5. 第五个分组：当前目录下的索引模块
    ],
    "newlines-between": "always",  // 每个分组之间必须有空行
    "alphabetize": {
      "order": "asc",             // 按字母升序排列
      "caseInsensitive": true     // 排序时不区分大小写
    }
  }
]
```

7. 添加以下代码设置 ECMAScript 版本和模块类型 ===> https://eslint.org/docs/latest/use/configure/language-options

```js
   {
    // 设置 ECMAScript 版本和模块类型
    languageOptions: {
      ecmaVersion: latest, // 使用 ECMAScript 2024 标准
      sourceType: 'module', // 指定代码使用 ES 模块化（import 和 export）语法
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
```
