import { createUnplugin } from 'unplugin';
import type { HyperFXPluginOptions } from './core/types.js';
import { HyperFXTransformer } from './core/transform.js';

/**
 * Vite-specific transform options
 * @see https://vite.dev/guide/api-plugin.html#universal-hooks
 */
interface ViteTransformOptions {
  ssr?: boolean;
}

export const unplugin = createUnplugin<HyperFXPluginOptions>((options) => {
  const transformer = new HyperFXTransformer(options);

  return {
    name: 'unplugin-hyperfx',
    enforce: 'pre', // Run before other plugins

    // Base transform hook for non-Vite bundlers
    // Defaults to client mode
    transform(code, id) {
      // Only process .tsx, .jsx, .ts, .js files
      if (!/\.[jt]sx?$/.test(id)) {
        return null;
      }

      // Skip node_modules
      if (id.includes('node_modules')) {
        return null;
      }

      // Default to client mode for non-Vite bundlers
      return transformer.transform(code, id, false);
    },

    // Vite-specific hooks
    vite: {
      // Override transform to use Vite's SSR detection
      transform(code: string, id: string, options?: ViteTransformOptions) {
        // Only process .tsx, .jsx, .ts, .js files
        if (!/\.[jt]sx?$/.test(id)) {
          return null;
        }

        // Skip node_modules
        if (id.includes('node_modules')) {
          return null;
        }

        // Use Vite's SSR flag from options
        // Vite automatically sets this based on the environment (client vs ssr)
        const isSSR = options?.ssr ?? false;
        return transformer.transform(code, id, isSSR);
      },

      // Ensure JSX is preserved for our plugin to handle
      config() {
        return {
          esbuild: {
            jsx: 'preserve', // Don't let esbuild transform JSX - we'll do it
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
