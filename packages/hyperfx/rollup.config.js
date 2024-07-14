import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

/** @type { import("@rollup/plugin-terser").Options} */
const terserOptions = {
  compress: true,
  mangle: true,
  keep_classnames: false,
  keep_fnames: false,
};

export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      minifyInternalExports: true,
      sourcemap: true,
    },
    {
      file: "dist/index.min.js",
      format: "cjs",
      compact: true,
      minifyInternalExports: true,
      sourcemap: true,
      plugins: [terser(terserOptions)],
    },
    {
      file: "dist/index.mjs",
      format: "module",
      minifyInternalExports: true,
      sourcemap: true,
    },
    {
      file: "dist/index.min.mjs",
      format: "module",
      compact: true,
      minifyInternalExports: true,
      sourcemap: true,

      plugins: [terser(terserOptions)],
    },
    {
      file: "dist/index.amd.js",
      format: "amd",
      sourcemap: true,

      minifyInternalExports: true,
    },
    {
      file: "dist/index.sys.js",
      sourcemap: true,
      format: "systemjs",
      minifyInternalExports: true,
    },
  ],

  plugins: [
    typescript({ declaration: true, declarationMap: true, outDir: "dist" }),
  ],
});
