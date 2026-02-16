import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import { nitro } from "nitro/vite";
import { hyperfxVite } from "hyperfx/vite";

export default defineConfig({

    
    clearScreen: false,

    plugins: [
        tailwindcss(),
       
        hyperfxVite({

        }) as any,

        nitro({
            builder: 'vite',
            publicAssets: [
                {
                    dir: '.output/public',
                    maxAge: 3600,
                    fallthrough: true
                }
            ],
           
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
           
        },
        client: {
            build: { rollupOptions: { input: "./src/client.tsx" } },
            // Client uses standard JSX runtime (no HyperFX compiler)
        },
    },



});
