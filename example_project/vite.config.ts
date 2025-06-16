import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

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

  esbuild: {
    jsx: "automatic",
    jsxImportSource: "hyperfx/jsx",
  },

  plugins: [
    tailwindcss()
  ],
});
