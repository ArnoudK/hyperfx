import type { HyperFXPluginOptions } from './core/types.js';
export declare const unplugin: import("unplugin").UnpluginInstance<HyperFXPluginOptions, boolean>;
export declare const hyperfxVite: (options: HyperFXPluginOptions) => import("unplugin").VitePlugin<any> | import("unplugin").VitePlugin<any>[];
export declare const hyperfxRollup: (options: HyperFXPluginOptions) => import("rollup").Plugin<any> | import("rollup").Plugin<any>[];
export declare const hyperfxWebpack: (options: HyperFXPluginOptions) => WebpackPluginInstance;
export declare const hyperfxEsbuild: (options: HyperFXPluginOptions) => import("unplugin").EsbuildPlugin;
export declare const hyperfxRspack: (options: HyperFXPluginOptions) => RspackPluginInstance;
export { unplugin as hyperfxUnplugin };
//# sourceMappingURL=index.d.ts.map