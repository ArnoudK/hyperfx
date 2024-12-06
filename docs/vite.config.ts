import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import { viteSingleFile } from "vite-plugin-singlefile";
export default defineConfig({
  appType: "spa",
  server: {
    port: 3030,
  },

  base: "/hyperfx",
  build: {
    target: "es6",
    ssr: false,
    rollupOptions: {
      output: {
        preserveModules: false,
        esModule: false,
        dynamicImportInCjs: true,
        inlineDynamicImports: true,
        generatedCode: {
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true,
          symbols: true,
        },
        minifyInternalExports: true,
        //        sourcemap: true,
        compact: true,
        format: "esm",
      },
    },
  },
  clearScreen: false,
  plugins: [
    viteSingleFile({
      removeViteModuleLoader: true,
      //      useRecommendedBuildConfig: true,
    }),
    viteCompression({ algorithm: "brotliCompress" }),
    viteCompression({ algorithm: "gzip" }),
  ],
});
