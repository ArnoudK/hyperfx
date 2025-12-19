
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import { nitro } from "nitro/vite";

export default defineConfig({

    esbuild: {
        jsx: "transform",
        jsxFragment: "Fragment",
        jsxImportSource: 'hyperfx/jsx',
        jsxFactory: "jsx",
        jsxInject: `import { jsx, Fragment } from 'hyperfx/jsx'`,
    },

    clearScreen: false,
    plugins: [
        tailwindcss(),
        nitro({
            builder: 'vite'
        })

    ],
    nitro: {

        serverDir: './'
    },

    environments: {
        ssr: {
            build: { rollupOptions: { input: "./src/server.tsx" } },
        },
        client: {
            build: { rollupOptions: { input: "./src/client.tsx" } },
        },
    },



});