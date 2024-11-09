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
```

一、标签内属性 vue/attributes-order 配置 官方文档 ===> https://eslint.vuejs.org/rules/attributes-order.html

1.  配置文件中添加 ` ...pluginVue.configs[('flat/recommended',xxx)],`
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
