import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
export default defineConfig({
  appType: "spa",
  build: {
    target: "es2020",
    ssr: false,
    modulePreload: true,

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
