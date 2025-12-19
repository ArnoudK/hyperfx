import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  appType: "spa",


  plugins: [
    tailwindcss()
  ],
});
