import { defineConfig } from 'vitest/config';
import { hyperfxVite } from '../hyperfx/src/compiler/vite'
export default defineConfig({
  test: {
    environment: 'happy-dom',

    globals: true,
  },
  esbuild: {
    jsx: 'preserve',
    jsxImportSource: 'hyperfx',
  },
  plugins: [
    hyperfxVite({

    })
  ]
});