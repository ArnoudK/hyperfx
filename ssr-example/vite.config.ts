import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import { nitro } from "nitro/vite";
import { hyperfxVite } from "hyperfx/vite";

export default defineConfig({

    esbuild: {
        jsx: "automatic",
        jsxImportSource: 'hyperfx/jsx',
    },

    clearScreen: false,

    plugins: [
        tailwindcss(),
        // hyperfxVite will be applied per-environment below
        nitro({
            builder: 'vite',
            publicAssets: [
                {
                    dir: '.output/public',
                    maxAge: 3600,
                    fallthrough: true
                }
            ],
            // Configure esbuild for SSR environment to use server JSX runtime
            esbuild: {
                jsx: "automatic",
                jsxImportSource: 'hyperfx/jsx-server',
            }
        })

    ],
    nitro: {

        serverDir: './'
    },

    environments: {
        ssr: {
            build: {
                rollupOptions: { input: "./src/server.tsx" },
            },
            // Use server JSX runtime for SSR environment
            resolve: {
                conditions: ['node']
            },
            // Apply HyperFX compiler ONLY to SSR environment
            plugins: [
                hyperfxVite({})
            ]
        },
        client: {
            build: { rollupOptions: { input: "./src/client.tsx" } },
            // Client uses standard JSX runtime (no HyperFX compiler)
        },
    },



});
