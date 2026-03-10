// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/@tailwindcss+vite@4.1.11_vi_1272071387ae73824b3661608cd6dc4d/node_modules/@tailwindcss/vite/dist/index.mjs";
import vue from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_479bf209af328c29bfc7aaec14365e27/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.2._a5cba8077b72f112035185cbfabbad7d/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/unplugin-auto-import@0.18.6_00b2d5f298cd576e692bcbcd6f1e7b85/node_modules/unplugin-auto-import/dist/vite.js";
import IconsResolver from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/unplugin-icons@0.20.2_@vue+compiler-sfc@3.5.17/node_modules/unplugin-icons/dist/resolver.js";
import Icons from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/unplugin-icons@0.20.2_@vue+compiler-sfc@3.5.17/node_modules/unplugin-icons/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/unplugin-vue-components@0.2_7f300d82db9355c8089459e884173274/node_modules/unplugin-vue-components/dist/resolvers.js";
import Components from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/unplugin-vue-components@0.2_7f300d82db9355c8089459e884173274/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig, loadEnv } from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/vite@5.4.19_@types+node@20._75e27da3c96cbf80bfbf1061bb0e6d8c/node_modules/vite/dist/node/index.js";
import vueDevTools from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/vite-plugin-vue-devtools@7._8befc63bdcda351b97555d7e6eba2c11/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";

// script/iconfont.ts
import fs from "node:fs";
import path from "node:path";
import chokidar from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/chokidar@4.0.3/node_modules/chokidar/esm/index.js";
import ejs from "file:///D:/project/study/my-project/vue-template/node_modules/.pnpm/ejs@3.1.10/node_modules/ejs/lib/ejs.js";
var __vite_injected_original_dirname = "D:\\project\\study\\my-project\\vue-template\\script";
var debounce = (func, delay = 1e3) => {
  let timer;
  return async (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(async () => {
        await func(...args);
        resolve();
      }, delay);
    });
  };
};
var sourceDir = path.resolve(__vite_injected_original_dirname, "__iconfont");
var targetDir = path.resolve(__vite_injected_original_dirname, "../src/components/icon-font/");
var ignored = [
  /\/src\/iconfont\/demo_index\.html$/,
  /\/src\/iconfont\/demo\.css$/,
  /\/src\/iconfont\/iconfont\.js$/,
  /\/src\/iconfont\/iconfont\.json$/,
  /\/src\/iconfont\/iconfont\.ttf$/,
  /\/src\/iconfont\/iconfont\.woff$/,
  /\/src\/iconfont\/iconfont\.woff2$/
];
function copyFile(sourceFile, targetFile) {
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`Source file "${sourceFile}" does not exist.`);
  }
  const fileContent = fs.readFileSync(sourceFile);
  fs.writeFileSync(targetFile, fileContent);
}
var cssDelimiter = [
  "/* [",
  "] */"
];
var jsDelimiter = [
  "'/* [",
  "] */'"
];
function getEjsData() {
  const css = fs.readFileSync(
    path.resolve(__vite_injected_original_dirname, "__iconfont", "iconfont.css"),
    "utf-8"
  );
  const index = css.indexOf(".icon-");
  const content = css.slice(index, css.length - 1).replace(/\r?\n*$/, "");
  const json = fs.readFileSync(path.resolve(__vite_injected_original_dirname, "__iconfont", "iconfont.json")).toString();
  const typesObject = JSON.parse(json).glyphs.map((e) => `'${e.font_class}'`).sort();
  const types = typesObject.join(" |\n").replace(/\r?\n*$/, "");
  const ejsData = {
    content,
    types
  };
  return ejsData;
}
function getTemplateData(templateName, [openDelimiter, closeDelimiter] = cssDelimiter) {
  const ejsData = getEjsData();
  const _templatePath = path.resolve(__vite_injected_original_dirname, "./__template", templateName);
  const source = fs.readFileSync(_templatePath).toString();
  const template = ejs.compile(source, {
    openDelimiter,
    closeDelimiter
  });
  return template(ejsData);
}
async function copy() {
  try {
    fs.writeFileSync(
      path.resolve(targetDir, "iconfont.css"),
      getTemplateData("iconfont.css"),
      "utf-8"
    );
    fs.writeFileSync(
      path.resolve(targetDir, "iconfont.ts"),
      getTemplateData("iconfont.ts", jsDelimiter)
    );
    await copyFile(
      path.resolve(__vite_injected_original_dirname, "__iconfont", "iconfont.js"),
      path.resolve(targetDir, "iconfont.js")
    );
  } catch (error) {
    console.error(`${error}`);
  }
}
function generatedIcons(isBuild) {
  if (isBuild)
    return;
  console.log("generatedIcons");
  const handler = debounce(copy);
  const watcher = chokidar.watch(sourceDir, {
    ignored
  });
  watcher.on("all", async (type) => {
    if (type !== "addDir" && type !== "unlink" && type !== "unlinkDir")
      handler();
  });
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///D:/project/study/my-project/vue-template/vite.config.ts";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isBuild = command === "build";
  return {
    define: {
      __DEV__: mode === "development",
      __PROD__: mode === "production",
      __APP_TITLE__: `"${env.VITE_APP_TITLE}"`,
      __API_URL__: `"${env.VITE_API_URL}"`
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
        "sass": "sass-embedded"
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/global.scss" as global; @use "@/styles/element/index.scss" as *;`,
          api: "modern-compiler"
        }
      }
    },
    plugins: [
      vue(),
      generatedIcons(isBuild),
      tailwindcss(),
      vueJsx(),
      vueDevTools(),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        dts: "./types/auto-imports.d.ts",
        // 指定生成的自动导入声明文件的路径
        dirs: ["./src/hooks", "./src/utils", "./src/stores"],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0L2ljb25mb250LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFxzdHVkeVxcXFxteS1wcm9qZWN0XFxcXHZ1ZS10ZW1wbGF0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFxzdHVkeVxcXFxteS1wcm9qZWN0XFxcXHZ1ZS10ZW1wbGF0ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdC9zdHVkeS9teS1wcm9qZWN0L3Z1ZS10ZW1wbGF0ZS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5cclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5cclxuaW1wb3J0IEljb25zUmVzb2x2ZXIgZnJvbSAndW5wbHVnaW4taWNvbnMvcmVzb2x2ZXInXHJcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJ1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xyXG5pbXBvcnQgeyBnZW5lcmF0ZWRJY29ucyB9IGZyb20gJy4vc2NyaXB0L2ljb25mb250J1xyXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpXHJcbiAgY29uc3QgaXNCdWlsZCA9IGNvbW1hbmQgPT09ICdidWlsZCdcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGRlZmluZToge1xyXG4gICAgICBfX0RFVl9fOiBtb2RlID09PSAnZGV2ZWxvcG1lbnQnLFxyXG4gICAgICBfX1BST0RfXzogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nLFxyXG4gICAgICBfX0FQUF9USVRMRV9fOiBgXCIke2Vudi5WSVRFX0FQUF9USVRMRX1cImAsXHJcbiAgICAgIF9fQVBJX1VSTF9fOiBgXCIke2Vudi5WSVRFX0FQSV9VUkx9XCJgLFxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgICAnc2Fzcyc6ICdzYXNzLWVtYmVkZGVkJyxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBjc3M6IHtcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIHNjc3M6IHtcclxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgQHVzZSBcIkAvc3R5bGVzL2dsb2JhbC5zY3NzXCIgYXMgZ2xvYmFsOyBAdXNlIFwiQC9zdHlsZXMvZWxlbWVudC9pbmRleC5zY3NzXCIgYXMgKjtgLFxyXG4gICAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKCksXHJcbiAgICAgIGdlbmVyYXRlZEljb25zKGlzQnVpbGQpLFxyXG5cclxuICAgICAgdGFpbHdpbmRjc3MoKSxcclxuICAgICAgdnVlSnN4KCksXHJcbiAgICAgIHZ1ZURldlRvb2xzKCksXHJcbiAgICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAncGluaWEnXSxcclxuICAgICAgICBkdHM6ICcuL3R5cGVzL2F1dG8taW1wb3J0cy5kLnRzJywgLy8gXHU2MzA3XHU1QjlBXHU3NTFGXHU2MjEwXHU3Njg0XHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1OEYwXHU2NjBFXHU2NTg3XHU0RUY2XHU3Njg0XHU4REVGXHU1Rjg0XHJcbiAgICAgICAgZGlyczogWycuL3NyYy9ob29rcycsICcuL3NyYy91dGlscycsICcuL3NyYy9zdG9yZXMnXSwgLy8gXHU1NDRBXHU4QkM5QXV0b0ltcG9ydFx1NjNEMlx1NEVGNlx1NTcyOFx1NTRFQVx1NEU5Qlx1NzZFRVx1NUY1NVx1NEUyRFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NkEyMVx1NTc1N1x1MzAwMlx1NjNEMlx1NEVGNlx1NEYxQVx1NjI2Qlx1NjNDRlx1OEZEOVx1NEU5Qlx1NzZFRVx1NUY1NVx1NEUyRFx1NzY4NFx1NjU4N1x1NEVGNlx1RkYwQ1x1NUU3Nlx1NjgzOVx1NjM2RVx1NjU4N1x1NEVGNlx1NTE4NVx1NUJCOVx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1NUJGQ1x1NTE2NVx1OEJFRFx1NTNFNVx1MzAwMlxyXG4gICAgICAgIGVzbGludHJjOiB7XHJcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLCAvLyBcdTc1MUZcdTYyMTAgRVNMaW50IFx1OTE0RFx1N0Y2RVx1RkYwQ1x1OTA3Rlx1NTE0RCBpbXBvcnQgXHU2MkE1XHU5NTE5XHJcbiAgICAgICAgICBmaWxlcGF0aDogJy4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb24nLCAvLyBEZWZhdWx0IGAuLy5lc2xpbnRyYy1hdXRvLWltcG9ydC5qc29uYFxyXG4gICAgICAgICAgZ2xvYmFsc1Byb3BWYWx1ZTogdHJ1ZSwgLy8gXHU4MUVBXHU1MkE4XHU4QkJFXHU3RjZFXHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoeyBpbXBvcnRTdHlsZTogJ3Nhc3MnIH0pLFxyXG4gICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XHJcbiAgICAgICAgICBJY29uc1Jlc29sdmVyKHtcclxuICAgICAgICAgICAgcHJlZml4OiAnSWNvbicsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICBdLFxyXG4gICAgICB9KSxcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgZGlyczogWycuL3NyYy9jb21wb25lbnRzJ10sXHJcbiAgICAgICAgZHRzOiAnLi90eXBlcy9jb21wb25lbnRzLmQudHMnLCAvLyBcdTYzMDdcdTVCOUFcdTc1MUZcdTYyMTBcdTc2ODRcdTdFQzRcdTRFRjZcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcdTc2ODRcdThERUZcdTVGODRcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NkNFOFx1NTE4Q1x1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxyXG4gICAgICAgICAgSWNvbnNSZXNvbHZlcih7XHJcbiAgICAgICAgICAgIHByZWZpeDogJ0ljb24nLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKHsgaW1wb3J0U3R5bGU6ICdzYXNzJyB9KSxcclxuICAgICAgICBdLFxyXG4gICAgICB9KSxcclxuICAgICAgSWNvbnMoe1xyXG4gICAgICAgIGF1dG9JbnN0YWxsOiB0cnVlLFxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcblxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcclxuICAgICAgb3BlbjogZmFsc2UsXHJcbiAgICAgIHBvcnQ6IDg4LFxyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZDoge1xyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgZXh0ZXJuYWw6IFsnZnMnXSwgLy8gXHU3ODZFXHU0RkREXHU0RTBEXHU2MjUzXHU1MzA1IE5vZGUuanMgXHU2QTIxXHU1NzU3XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH1cclxufSlcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXHN0dWR5XFxcXG15LXByb2plY3RcXFxcdnVlLXRlbXBsYXRlXFxcXHNjcmlwdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFxzdHVkeVxcXFxteS1wcm9qZWN0XFxcXHZ1ZS10ZW1wbGF0ZVxcXFxzY3JpcHRcXFxcaWNvbmZvbnQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3Byb2plY3Qvc3R1ZHkvbXktcHJvamVjdC92dWUtdGVtcGxhdGUvc2NyaXB0L2ljb25mb250LnRzXCI7aW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xyXG5cclxuaW1wb3J0IGNob2tpZGFyIGZyb20gJ2Nob2tpZGFyJztcclxuaW1wb3J0IGVqcyBmcm9tICdlanMnO1xyXG5cclxudHlwZSBEZWJvdW5jZUZ1bmN0aW9uID0gPFQgZXh0ZW5kcyAoLi4uYXJnczogYW55W10pID0+IGFueT4oXHJcbiAgZnVuYzogVCxcclxuICBkZWxheT86IG51bWJlclxyXG4pID0+ICguLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+KSA9PiB2b2lkO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlYm91bmNlOiBEZWJvdW5jZUZ1bmN0aW9uID0gKGZ1bmMsIGRlbGF5ID0gMTAwMCkgPT4ge1xyXG4gIGxldCB0aW1lcjogTm9kZUpTLlRpbWVvdXQ7XHJcblxyXG4gIHJldHVybiBhc3luYyAoLi4uYXJncykgPT4ge1xyXG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xyXG4gICAgICB0aW1lciA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGF3YWl0IGZ1bmMoLi4uYXJncyk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9LCBkZWxheSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3Qgc291cmNlRGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ19faWNvbmZvbnQnKTtcclxuY29uc3QgdGFyZ2V0RGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL3NyYy9jb21wb25lbnRzL2ljb24tZm9udC8nKTtcclxuXHJcbmNvbnN0IGlnbm9yZWQgPSBbXHJcbiAgL1xcL3NyY1xcL2ljb25mb250XFwvZGVtb19pbmRleFxcLmh0bWwkLyxcclxuICAvXFwvc3JjXFwvaWNvbmZvbnRcXC9kZW1vXFwuY3NzJC8sXHJcbiAgL1xcL3NyY1xcL2ljb25mb250XFwvaWNvbmZvbnRcXC5qcyQvLFxyXG4gIC9cXC9zcmNcXC9pY29uZm9udFxcL2ljb25mb250XFwuanNvbiQvLFxyXG4gIC9cXC9zcmNcXC9pY29uZm9udFxcL2ljb25mb250XFwudHRmJC8sXHJcbiAgL1xcL3NyY1xcL2ljb25mb250XFwvaWNvbmZvbnRcXC53b2ZmJC8sXHJcbiAgL1xcL3NyY1xcL2ljb25mb250XFwvaWNvbmZvbnRcXC53b2ZmMiQvLFxyXG5dO1xyXG5cclxuZnVuY3Rpb24gY29weUZpbGUoc291cmNlRmlsZTogc3RyaW5nLCB0YXJnZXRGaWxlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAvLyBcdTY4QzBcdTY3RTVcdTZFOTBcdTY1ODdcdTRFRjZcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcclxuICBpZiAoIWZzLmV4aXN0c1N5bmMoc291cmNlRmlsZSkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgU291cmNlIGZpbGUgXCIke3NvdXJjZUZpbGV9XCIgZG9lcyBub3QgZXhpc3QuYCk7XHJcbiAgfVxyXG5cclxuICAvLyBcdThCRkJcdTUzRDZcdTZFOTBcdTY1ODdcdTRFRjZcdTUxODVcdTVCQjkgKFx1NEY1Q1x1NEUzQUJ1ZmZlclx1NTkwNFx1NzQwNlx1NEU4Q1x1OEZEQlx1NTIzNlx1NjU4N1x1NEVGNilcclxuICBjb25zdCBmaWxlQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhzb3VyY2VGaWxlKTtcclxuXHJcbiAgLy8gXHU1MTk5XHU1MTY1XHU3NkVFXHU2ODA3XHU2NTg3XHU0RUY2IChCdWZmZXJcdTY2MkZVaW50OEFycmF5XHU3Njg0XHU1QjUwXHU3QzdCXHVGRjBDXHU2RUUxXHU4REIzQXJyYXlCdWZmZXJWaWV3XHU4OTgxXHU2QzQyKVxyXG4gIGZzLndyaXRlRmlsZVN5bmModGFyZ2V0RmlsZSwgZmlsZUNvbnRlbnQgYXMgdW5rbm93biBhcyBVaW50OEFycmF5KTtcclxufVxyXG5cclxuY29uc3QgY3NzRGVsaW1pdGVyID0gW1xyXG4gICcvKiBbJyxcclxuICAnXSAqLycsXHJcbl0gYXMgW3N0cmluZywgc3RyaW5nXTtcclxuXHJcbmNvbnN0IGpzRGVsaW1pdGVyID0gW1xyXG4gICdcXCcvKiBbJyxcclxuICAnXSAqL1xcJycsXHJcbl0gYXMgW3N0cmluZywgc3RyaW5nXTtcclxuXHJcbmZ1bmN0aW9uIGdldEVqc0RhdGEoKSB7XHJcbiAgY29uc3QgY3NzID0gZnMucmVhZEZpbGVTeW5jKFxyXG4gICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ19faWNvbmZvbnQnLCAnaWNvbmZvbnQuY3NzJyksXHJcbiAgICAndXRmLTgnLFxyXG4gICk7XHJcbiAgY29uc3QgaW5kZXggPSBjc3MuaW5kZXhPZignLmljb24tJyk7XHJcbiAgY29uc3QgY29udGVudCA9IGNzcy5zbGljZShpbmRleCwgY3NzLmxlbmd0aCAtIDEpLnJlcGxhY2UoL1xccj9cXG4qJC8sICcnKTtcclxuICAvLyB0eXBlc1xyXG4gIGNvbnN0IGpzb24gPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ19faWNvbmZvbnQnLCAnaWNvbmZvbnQuanNvbicpKS50b1N0cmluZygpO1xyXG4gIGNvbnN0IHR5cGVzT2JqZWN0ID0gKEpTT04ucGFyc2UoanNvbikuZ2x5cGhzIGFzIHsgZm9udF9jbGFzczogc3RyaW5nIH1bXSkubWFwKGUgPT4gYCcke2UuZm9udF9jbGFzc30nYCkuc29ydCgpO1xyXG4gIGNvbnN0IHR5cGVzID0gdHlwZXNPYmplY3Quam9pbignIHxcXG4nKS5yZXBsYWNlKC9cXHI/XFxuKiQvLCAnJyk7XHJcbiAgY29uc3QgZWpzRGF0YSA9IHtcclxuICAgIGNvbnRlbnQsXHJcbiAgICB0eXBlcyxcclxuICB9O1xyXG5cclxuICByZXR1cm4gZWpzRGF0YTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGVtcGxhdGVEYXRhKHRlbXBsYXRlTmFtZTogc3RyaW5nLCBbb3BlbkRlbGltaXRlciwgY2xvc2VEZWxpbWl0ZXJdOiBbc3RyaW5nLCBzdHJpbmddID0gY3NzRGVsaW1pdGVyKSB7XHJcbiAgY29uc3QgZWpzRGF0YSA9IGdldEVqc0RhdGEoKTtcclxuICBjb25zdCBfdGVtcGxhdGVQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vX190ZW1wbGF0ZScsIHRlbXBsYXRlTmFtZSk7XHJcbiAgY29uc3Qgc291cmNlID0gZnMucmVhZEZpbGVTeW5jKF90ZW1wbGF0ZVBhdGgpLnRvU3RyaW5nKCk7XHJcbiAgY29uc3QgdGVtcGxhdGUgPSBlanMuY29tcGlsZShzb3VyY2UsIHtcclxuICAgIG9wZW5EZWxpbWl0ZXIsXHJcbiAgICBjbG9zZURlbGltaXRlcixcclxuICB9KTtcclxuICByZXR1cm4gdGVtcGxhdGUoZWpzRGF0YSk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNvcHkoKSB7XHJcbiAgdHJ5IHtcclxuICAgIC8vIGZvbnRzXHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKFxyXG4gICAgICBwYXRoLnJlc29sdmUodGFyZ2V0RGlyLCAnaWNvbmZvbnQuY3NzJyksXHJcbiAgICAgIGdldFRlbXBsYXRlRGF0YSgnaWNvbmZvbnQuY3NzJyksXHJcbiAgICAgICd1dGYtOCcsXHJcbiAgICApO1xyXG5cclxuICAgIC8vIHR5cGVzXHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKFxyXG4gICAgICBwYXRoLnJlc29sdmUodGFyZ2V0RGlyLCAnaWNvbmZvbnQudHMnKSxcclxuICAgICAgZ2V0VGVtcGxhdGVEYXRhKCdpY29uZm9udC50cycsIGpzRGVsaW1pdGVyKSxcclxuICAgICk7XHJcblxyXG4gICAgLy8gLy8gXHU1QjU3XHU0RjUzXHJcblxyXG4gICAgYXdhaXQgY29weUZpbGUoXHJcbiAgICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdfX2ljb25mb250JywgJ2ljb25mb250LmpzJyksXHJcbiAgICAgIHBhdGgucmVzb2x2ZSh0YXJnZXREaXIsICdpY29uZm9udC5qcycpLFxyXG4gICAgKTtcclxuICB9XHJcbiAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKGAke2Vycm9yfWApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlZEljb25zKGlzQnVpbGQ6IGJvb2xlYW4pIHtcclxuICBpZiAoaXNCdWlsZClcclxuICAgIHJldHVybjtcclxuICBjb25zb2xlLmxvZygnZ2VuZXJhdGVkSWNvbnMnKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlciA9IGRlYm91bmNlKGNvcHkpO1xyXG5cclxuICBjb25zdCB3YXRjaGVyID0gY2hva2lkYXIud2F0Y2goc291cmNlRGlyLCB7XHJcbiAgICBpZ25vcmVkLFxyXG4gIH0pO1xyXG5cclxuICB3YXRjaGVyLm9uKCdhbGwnLCBhc3luYyAodHlwZSkgPT4ge1xyXG4gICAgaWYgKHR5cGUgIT09ICdhZGREaXInICYmIHR5cGUgIT09ICd1bmxpbmsnICYmIHR5cGUgIT09ICd1bmxpbmtEaXInKVxyXG4gICAgICBoYW5kbGVyKCk7XHJcbiAgfSk7XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVCxTQUFTLGVBQWUsV0FBVztBQUV2VixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBRXZCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sV0FBVztBQUNsQixTQUFTLDJCQUEyQjtBQUNwQyxPQUFPLGdCQUFnQjtBQUN2QixTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLGlCQUFpQjs7O0FDWjZTLE9BQU8sUUFBUTtBQUNwVixPQUFPLFVBQVU7QUFFakIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sU0FBUztBQUpoQixJQUFNLG1DQUFtQztBQVdsQyxJQUFNLFdBQTZCLENBQUMsTUFBTSxRQUFRLFFBQVM7QUFDaEUsTUFBSTtBQUVKLFNBQU8sVUFBVSxTQUFTO0FBQ3hCLGlCQUFhLEtBQUs7QUFDbEIsV0FBTyxJQUFJLFFBQWMsQ0FBQyxZQUFZO0FBQ3BDLGNBQVEsV0FBVyxZQUFZO0FBQzdCLGNBQU0sS0FBSyxHQUFHLElBQUk7QUFDbEIsZ0JBQVE7QUFBQSxNQUNWLEdBQUcsS0FBSztBQUFBLElBQ1YsQ0FBQztBQUFBLEVBQ0g7QUFDRjtBQUVBLElBQU0sWUFBWSxLQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUN0RCxJQUFNLFlBQVksS0FBSyxRQUFRLGtDQUFXLDhCQUE4QjtBQUV4RSxJQUFNLFVBQVU7QUFBQSxFQUNkO0FBQUEsRUFDQTtBQUFBLEVB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
