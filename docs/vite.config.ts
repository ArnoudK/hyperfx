import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import {viteSingleFile } from 'vite-plugin-singlefile'
export default defineConfig({
  appType: "spa",
  server: {
    port: 3030,
  },

  base: "/hyperfx",

  clearScreen: false,
  plugins: [
    tailwindcss(),
    viteSingleFile()
  ],
});
