import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'

import { hyperfxVite} from 'hyperfx/vite'

export default defineConfig({
  appType: "spa",
  server: {
    port: 3030,
  },

  base: "/hyperfx",

  clearScreen: false,
  plugins: [
    tailwindcss(),
    hyperfxVite({})

  ],
});
