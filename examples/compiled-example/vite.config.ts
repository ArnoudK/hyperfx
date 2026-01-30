import { defineConfig } from 'vite';
import { hyperfxVite } from 'unplugin-hyperfx/vite';

export default defineConfig({
  plugins: [
    hyperfxVite({
      optimize: {
        templates: true,
        events: true,
        constants: true,
      },
      dev: {
        warnings: true,
        sourceMap: true,
      },
    }),
  ],
  esbuild: {
    jsx: 'preserve', // Let unplugin-hyperfx handle JSX
  },
});
