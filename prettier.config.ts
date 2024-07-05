// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs
import { Config } from "prettier";
export default {
  trailingComma: "all",
  tabWidth: 8,
  semi: true,
  singleQuote: true,
  arrowParens: "avoid",
  useTabs: true,
  experimentalTernaries: true,
  /* this doesn't seem to work TODO */
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindConfig: "./example_project/tailwind.config.ts",
  tailwindAttributes: ["class: "],
} satisfies Config;
