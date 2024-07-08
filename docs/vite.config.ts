import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";
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
        minifyInternalExports: true,
        compact: true,
      },
    },
  },
  clearScreen: false,
  plugins: [
    VitePWA({
      devOptions: {
        enabled: true,
      },

      strategies: "generateSW",
      workbox: {
        inlineWorkboxRuntime: true,
        navigateFallback: "/hyperfx",
        cleanupOutdatedCaches: true,
      },
      injectRegister: "script-defer",
      minify: true,
      manifest: {
        name: "HyperFX Docs",
        lang: "en",
        start_url: "/hyperfx",
        scope: "/hyperfx",
        background_color: "#1E293B",
        theme_color: "#A5B4FC",
      },
    }),
    viteCompression({ algorithm: "brotliCompress" }),
    viteCompression({ algorithm: "gzip" }),
  ],
});
