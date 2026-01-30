import { createUnplugin } from 'unplugin';
import type { HyperFXPluginOptions } from './core/types.js';
import { HyperFXTransformer } from './core/transform.js';



export const unplugin = createUnplugin<HyperFXPluginOptions>((options) => {
  const transformer = new HyperFXTransformer(options);

  return {
    name: 'unplugin-hyperfx',

    // Transform hook - runs on every file
    transform(code, id) {
      // Only process .tsx, .jsx, .ts, .js files
      if (!/\.[jt]sx?$/.test(id)) {
        return null;
      }

      // Skip node_modules
      if (id.includes('node_modules')) {
        return null;
      }

      return transformer.transform(code, id);
    },

    // Vite-specific hooks
    vite: {
      // Ensure JSX is handled
      config() {
        return {
          esbuild: {
            jsx: 'preserve', // Prevent Vite from transforming JSX
          },
        };
      },
    },

    // Webpack-specific hooks
    webpack(compiler) {
      // Configure webpack to preserve JSX
      compiler.options.module = compiler.options.module || {};
      compiler.options.module.rules = compiler.options.module.rules || [];
    },
  };
});

// Export plugin for different bundlers with clear, descriptive names
export const hyperfxVite = unplugin.vite;
export const hyperfxRollup = unplugin.rollup;
export const hyperfxWebpack = unplugin.webpack;
export const hyperfxEsbuild = unplugin.esbuild;
export const hyperfxRspack = unplugin.rspack;

// Export the base unplugin instance for advanced use cases
export { unplugin as hyperfxUnplugin };
