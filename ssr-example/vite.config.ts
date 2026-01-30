import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import { nitro } from "nitro/vite";
// Temporarily disable hyperfx compiler for SSR testing
// import {hyperfxVite} from "unplugin-hyperfx/vite";

export default defineConfig({

    esbuild: {
        jsx: "automatic",
        jsxImportSource: 'hyperfx/jsx',
    },

    clearScreen: false,
    
    plugins: [
        tailwindcss(),
        // Disable compiler optimizations for now - they conflict with SSR
        // hyperfxVite({
        //     ssr: true,
        //     optimize: {
        //         templates: false,
        //         events: true,
        //         constants: true,
        //         ssr: true,
        //     }
        // }),
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
            }
        },
        client: {
            build: { rollupOptions: { input: "./src/client.tsx" } },
        },
    },



});
