
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    clearScreen: false,
    plugins: [
        tailwindcss(),
    ],
});