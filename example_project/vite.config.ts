import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { hyperfxVite} from 'hyperfx/vite'
export default defineConfig({
  appType: "spa",


  plugins: [
    tailwindcss(),
    hyperfxVite({
      ssr: false,
    })
  ],
});
