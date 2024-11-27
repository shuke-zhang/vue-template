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

三、配置 ECMAScript 版本和模块类型

https://eslint.org/docs/latest/use/configure/language-options

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

四、配置 全局变量
https://eslint.org/docs/latest/use/configure/language-options#using-configuration-files

```js
     globals: {
        var1: 'writable', // 声明一个可写的全局变量
        ResponseResult: 'readonly', // 声明一个只读的全局变量
        ResponseList: 'readonly',
        ResponseData: 'readonly',
      }
```

# UI 组件库引入

### 一、ElementPlus安装

1.  `pnpm add element-plus` 安装依赖

### 二、按需引入

https://element-plus.org/zh-CN/guide/quickstart.html#%E6%8C%89%E9%9C%80%E5%AF%BC%E5%85%A5

1. `pnpm add -D unplugin-vue-components unplugin-auto-import` 安装依赖
2. vite 配置文件中添加以下代码

```js
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      dts: './types/auto-imports.d.ts', // 指定生成的自动导入声明文件的路径
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: './types/auto-imports.d.ts', //  指定生成的组件声明文件的路径
      resolvers: [ElementPlusResolver()],
    }),
  ],
});
```

3. 此时如果使用 ElMessageBox 等组件会出现 TS 报错 `找不到名称“ElMessageBox”。ts-plugin`
   解决方法：

- 修改 tsconfig.json 配置： include 中增加 "types/\*_/_.d.ts"
- 若 tsconfig.json 中没有配置include，则修改 tsconfig.app.json
- 此时如果是项目默认配置应该是 `"include": ["env.d.ts", "src/**/*", "src/**/*.vue", "types/**/*.d.ts"]`

> **注意：** 使用按需引入后，不能再手动引入 ElMessageBox ，否则会引起样式冲突，需要删除手动引入 ElMessageBox 部分代码

4. 如果eslint规则配置为 `'no-undef': 'error',` 即使用 ElMessageBox 等组件报错 `ElMessageBox' is not defined.eslint(no-undef) `
   解决方法：

   - 在 vite.config 中 AutoImport 添加

   ```js
    eslintrc: {
       enabled: true, // 生成 ESLint 配置，避免 import 报错
       filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
       globalsPropValue: true, // 自动设置全局变量
     }
   ```

   - 在eslint.config.js 中添加

   ```js
   import autoImportConfig from './.eslintrc-auto-import.json' with { type: 'json' };
   // 或者
   import autoImportConfig from './.eslintrc-auto-import.json' assert  { type: 'json' };

     globals: {
       ...autoImportConfig.globals,
     },
   ```

   > **注意：** 使用assert 会报警告 'assert' is deprecated in import statements and support will be removed in V8 v12.6 and Chrome 126; use 'with' instead
   > 为了支持最新的版本，使用with 即可

5. icon图标按需导入
   - 安装 `pnpm install unplugin-icons --save-dev` 和 `pnpm install @element-plus/icons-vue`
   - vite.config.js 中添加以下代码

```js
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';

    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),

     Components({
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
```

# 自动导入插件配置

### 一、vite.config.ts配置

- 添加一下代码可对 vue vue-router pinia 自动导入
- dirs中可对 hooks 中的问价能实现自动导入

```js
AutoImport({
  imports: ['vue', 'vue-router', 'pinia'],
  dirs: ['./src/hooks'], // 告诉AutoImport插件在哪些目录中自动导入模块。插件会扫描这些目录中的文件，并根据文件内容自动生成导入语句。
});

Components({
  dirs: ['./src/components'], // 用于src/components目录下的所有组件都会被自动导入。
});
```
