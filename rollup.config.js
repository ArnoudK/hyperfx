import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
/** @type {import("rollup").RollupOptions} */
export default {
	input: 'src/index.ts',

	output: [
		{
			// Default
			file: 'dist/index.js',
			name: 'hyperFX',
			format: 'cjs',
			minifyInternalExports: true,
		},
		{
			// ESM
			file: 'dist/index.mjs',
			format: 'esm',
			esModule: true,
		},
		{
			// MIN
			file: 'dist/index.min.js',
			format: 'cjs',
			minifyInternalExports: true,
			plugins: [
				terser({
					compress: true,
					mangle: true,
				}),
			],
		},
	],
	plugins: [
		typescript({ tsconfig: './tsconfig.json', outputToFilesystem: true }),
        nodeResolve()

	],
};
