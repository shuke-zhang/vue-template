// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import vue from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/@vitejs+plugin-vue@5.2.2_vi_81597e564fff2ff522a3adaa38335611/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.1._451b085eef887a38aa50eaa6cccb8f8a/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import UnoCSS from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/unocss@0.64.1_postcss@8.5.3_2d218d4e1692d111a45de2542a086a28/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/unplugin-auto-import@0.18.6_8bf9ab539ebdc919fad8d7b97bb53245/node_modules/unplugin-auto-import/dist/vite.js";
import IconsResolver from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/unplugin-icons@0.20.2_@vue+compiler-sfc@3.5.13/node_modules/unplugin-icons/dist/resolver.js";
import Icons from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/unplugin-icons@0.20.2_@vue+compiler-sfc@3.5.13/node_modules/unplugin-icons/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/unplugin-vue-components@0.2_1ec3ba69cfd7c0ed776d19d8ef9fe504/node_modules/unplugin-vue-components/dist/resolvers.js";
import Components from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/unplugin-vue-components@0.2_1ec3ba69cfd7c0ed776d19d8ef9fe504/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig, loadEnv } from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/vite@5.4.14_@types+node@20.17.24_sass@1.85.1/node_modules/vite/dist/node/index.js";
import vueDevTools from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/vite-plugin-vue-devtools@7._bffb3e4edad58b3c3f92617e1f7496ee/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/project/study/my-project/vue-template/vite.config.ts";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __DEV__: mode == "development",
      __PROD__: mode == "production",
      __APP_TITLE__: `"${env.VITE_APP_TITLE}"`,
      __API_URL__: `"${env.VITE_API_URL}"`
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/global.scss" as global; @use "@/styles/element/index.scss" as *;`
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      UnoCSS(),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        dts: "./types/auto-imports.d.ts",
        // 指定生成的自动导入声明文件的路径
        dirs: ["./src/hooks"],
        // 告诉AutoImport插件在哪些目录中自动导入模块。插件会扫描这些目录中的文件，并根据文件内容自动生成导入语句。
        eslintrc: {
          enabled: true,
          // 生成 ESLint 配置，避免 import 报错
          filepath: "./.eslintrc-auto-import.json",
          // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true
          // 自动设置全局变量
        },
        resolvers: [
          ElementPlusResolver({ importStyle: "sass" }),
          // 自动导入图标组件
          IconsResolver({
            prefix: "Icon"
          })
        ]
      }),
      Components({
        dirs: ["./src/components"],
        dts: "./types/components.d.ts",
        // 指定生成的组件声明文件的路径
        resolvers: [
          // 自动注册图标组件
          IconsResolver({
            prefix: "Icon"
          }),
          ElementPlusResolver({ importStyle: "sass" })
        ]
      }),
      Icons({
        autoInstall: true
      })
    ],
    server: {
      host: "0.0.0.0",
      open: false,
      port: 88
    },
    build: {
      rollupOptions: {
        external: ["fs"]
        // 确保不打包 Node.js 模块
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXHN0dWR5XFxcXG15LXByb2plY3RcXFxcdnVlLXRlbXBsYXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXHN0dWR5XFxcXG15LXByb2plY3RcXFxcdnVlLXRlbXBsYXRlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9wcm9qZWN0L3N0dWR5L215LXByb2plY3QvdnVlLXRlbXBsYXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnO1xyXG5cclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnO1xyXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJztcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSc7XHJcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJztcclxuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnO1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJztcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJztcclxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGRlZmluZToge1xyXG4gICAgICBfX0RFVl9fOiBtb2RlID09ICdkZXZlbG9wbWVudCcsXHJcbiAgICAgIF9fUFJPRF9fOiBtb2RlID09ICdwcm9kdWN0aW9uJyxcclxuICAgICAgX19BUFBfVElUTEVfXzogYFwiJHtlbnYuVklURV9BUFBfVElUTEV9XCJgLFxyXG4gICAgICBfX0FQSV9VUkxfXzogYFwiJHtlbnYuVklURV9BUElfVVJMfVwiYCxcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICBzY3NzOiB7XHJcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEB1c2UgXCJAL3N0eWxlcy9nbG9iYWwuc2Nzc1wiIGFzIGdsb2JhbDsgQHVzZSBcIkAvc3R5bGVzL2VsZW1lbnQvaW5kZXguc2Nzc1wiIGFzICo7YCxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKCksXHJcbiAgICAgIHZ1ZUpzeCgpLFxyXG4gICAgICB2dWVEZXZUb29scygpLFxyXG4gICAgICBVbm9DU1MoKSxcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgaW1wb3J0czogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYSddLFxyXG4gICAgICAgIGR0czogJy4vdHlwZXMvYXV0by1pbXBvcnRzLmQudHMnLCAvLyBcdTYzMDdcdTVCOUFcdTc1MUZcdTYyMTBcdTc2ODRcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcdTc2ODRcdThERUZcdTVGODRcclxuICAgICAgICBkaXJzOiBbJy4vc3JjL2hvb2tzJ10sIC8vIFx1NTQ0QVx1OEJDOUF1dG9JbXBvcnRcdTYzRDJcdTRFRjZcdTU3MjhcdTU0RUFcdTRFOUJcdTc2RUVcdTVGNTVcdTRFMkRcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTZBMjFcdTU3NTdcdTMwMDJcdTYzRDJcdTRFRjZcdTRGMUFcdTYyNkJcdTYzQ0ZcdThGRDlcdTRFOUJcdTc2RUVcdTVGNTVcdTRFMkRcdTc2ODRcdTY1ODdcdTRFRjZcdUZGMENcdTVFNzZcdTY4MzlcdTYzNkVcdTY1ODdcdTRFRjZcdTUxODVcdTVCQjlcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdTVCRkNcdTUxNjVcdThCRURcdTUzRTVcdTMwMDJcclxuICAgICAgICBlc2xpbnRyYzoge1xyXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSwgLy8gXHU3NTFGXHU2MjEwIEVTTGludCBcdTkxNERcdTdGNkVcdUZGMENcdTkwN0ZcdTUxNEQgaW1wb3J0IFx1NjJBNVx1OTUxOVxyXG4gICAgICAgICAgZmlsZXBhdGg6ICcuLy5lc2xpbnRyYy1hdXRvLWltcG9ydC5qc29uJywgLy8gRGVmYXVsdCBgLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvbmBcclxuICAgICAgICAgIGdsb2JhbHNQcm9wVmFsdWU6IHRydWUsIC8vIFx1ODFFQVx1NTJBOFx1OEJCRVx1N0Y2RVx1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKHsgaW1wb3J0U3R5bGU6ICdzYXNzJyB9KSxcclxuICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxyXG4gICAgICAgICAgSWNvbnNSZXNvbHZlcih7XHJcbiAgICAgICAgICAgIHByZWZpeDogJ0ljb24nLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgXSxcclxuICAgICAgfSksXHJcbiAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgIGRpcnM6IFsnLi9zcmMvY29tcG9uZW50cyddLFxyXG4gICAgICAgIGR0czogJy4vdHlwZXMvY29tcG9uZW50cy5kLnRzJywgLy8gXHU2MzA3XHU1QjlBXHU3NTFGXHU2MjEwXHU3Njg0XHU3RUM0XHU0RUY2XHU1OEYwXHU2NjBFXHU2NTg3XHU0RUY2XHU3Njg0XHU4REVGXHU1Rjg0XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTZDRThcdTUxOENcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcclxuICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICBwcmVmaXg6ICdJY29uJyxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcih7IGltcG9ydFN0eWxlOiAnc2FzcycgfSksXHJcbiAgICAgICAgXSxcclxuICAgICAgfSksXHJcbiAgICAgIEljb25zKHtcclxuICAgICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcclxuICAgICAgfSksXHJcbiAgICBdLFxyXG5cclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgIG9wZW46IGZhbHNlLFxyXG4gICAgICBwb3J0OiA4OCxcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIGV4dGVybmFsOiBbJ2ZzJ10sIC8vIFx1Nzg2RVx1NEZERFx1NEUwRFx1NjI1M1x1NTMwNSBOb2RlLmpzIFx1NkEyMVx1NTc1N1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVCxTQUFTLGVBQWUsV0FBVztBQUV2VixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFdBQVc7QUFDbEIsU0FBUywyQkFBMkI7QUFDcEMsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxpQkFBaUI7QUFYeUssSUFBTSwyQ0FBMkM7QUFhbFAsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRTNDLFNBQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNOLFNBQVMsUUFBUTtBQUFBLE1BQ2pCLFVBQVUsUUFBUTtBQUFBLE1BQ2xCLGVBQWUsSUFBSSxJQUFJLGNBQWM7QUFBQSxNQUNyQyxhQUFhLElBQUksSUFBSSxZQUFZO0FBQUEsSUFDbkM7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsTUFDdEQ7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixPQUFPO0FBQUEsTUFDUCxZQUFZO0FBQUEsTUFDWixPQUFPO0FBQUEsTUFDUCxXQUFXO0FBQUEsUUFDVCxTQUFTLENBQUMsT0FBTyxjQUFjLE9BQU87QUFBQSxRQUN0QyxLQUFLO0FBQUE7QUFBQSxRQUNMLE1BQU0sQ0FBQyxhQUFhO0FBQUE7QUFBQSxRQUNwQixVQUFVO0FBQUEsVUFDUixTQUFTO0FBQUE7QUFBQSxVQUNULFVBQVU7QUFBQTtBQUFBLFVBQ1Ysa0JBQWtCO0FBQUE7QUFBQSxRQUNwQjtBQUFBLFFBQ0EsV0FBVztBQUFBLFVBQ1Qsb0JBQW9CLEVBQUUsYUFBYSxPQUFPLENBQUM7QUFBQTtBQUFBLFVBRTNDLGNBQWM7QUFBQSxZQUNaLFFBQVE7QUFBQSxVQUNWLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRixDQUFDO0FBQUEsTUFDRCxXQUFXO0FBQUEsUUFDVCxNQUFNLENBQUMsa0JBQWtCO0FBQUEsUUFDekIsS0FBSztBQUFBO0FBQUEsUUFDTCxXQUFXO0FBQUE7QUFBQSxVQUVULGNBQWM7QUFBQSxZQUNaLFFBQVE7QUFBQSxVQUNWLENBQUM7QUFBQSxVQUNELG9CQUFvQixFQUFFLGFBQWEsT0FBTyxDQUFDO0FBQUEsUUFDN0M7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELE1BQU07QUFBQSxRQUNKLGFBQWE7QUFBQSxNQUNmLENBQUM7QUFBQSxJQUNIO0FBQUEsSUFFQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBRUEsT0FBTztBQUFBLE1BQ0wsZUFBZTtBQUFBLFFBQ2IsVUFBVSxDQUFDLElBQUk7QUFBQTtBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
