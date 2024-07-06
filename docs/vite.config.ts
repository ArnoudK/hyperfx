import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
export default defineConfig({
  appType: "spa",
  server: {
    port: 3030,
  },
  base: "/hyperfx",
  build: {
    target: "es2020",
    ssr: false,
    modulePreload: true,
    minify: true,
    rollupOptions: {
      output: {
        minifyInternalExports: true,
        compact: true,
      },
    },
  },

  plugins: [
    viteCompression({ algorithm: "brotliCompress" }),
    viteCompression({ algorithm: "gzip" }),
  ],
});
