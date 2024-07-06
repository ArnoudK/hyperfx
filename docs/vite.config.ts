import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
export default defineConfig({
  appType: "spa",
  server: {
    port: 3030,
  },

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
