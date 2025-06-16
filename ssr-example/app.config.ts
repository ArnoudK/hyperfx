import { createApp } from "vinxi";
import tailwindcss from "@tailwindcss/vite";

export default createApp({
    server: {
        routeRules: {
            // Fix MIME type for TypeScript files
            "/src/**/*.ts": { 
                headers: { 
                    "content-type": "application/javascript; charset=utf-8",
                    "x-content-type-options": "nosniff"
                } 
            },
            "/src/**/*.tsx": { 
                headers: { 
                    "content-type": "application/javascript; charset=utf-8",
                    "x-content-type-options": "nosniff"
                } 
            },
            // Cache control for build assets
            "/_build/**": { 
                headers: { 
                    "cache-control": "public, max-age=31536000",
                    "x-content-type-options": "nosniff"
                } 
            },
        },
    },
    routers: [
        {
            name: "public",
            type: "static",
            dir: "./public",
        },
        {
            name: "client",
            type: "client",
            handler: "./src/client.ts",
            target: "browser",
            base: "/_build",
            plugins: () => [tailwindcss()]
        },
        {
            name: "ssr",
            type: "http",
            handler: "./src/server.ts",
            target: "server",
            base: "/",
            plugins: () => [tailwindcss()]
        },
    ],
});
