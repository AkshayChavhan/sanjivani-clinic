// @ts-check
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default defineConfig([
  // ESLint lints dot-folders and doesn't read .gitignore, so list what to skip:
  // build output, generated files, third-party skills, docs and scratch folders.
  globalIgnores([
    "dist/",
    ".astro/",
    ".vercel/",
    ".claude/",
    "document/",
    ".compound-engineering/",
    ".worktrees/",
    ".context/",
    "design-system/",
  ]),
  js.configs.recommended,
  // typescript-eslint comes before astro, so astro's parser wins for .astro files.
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    // TypeScript already checks that names exist, so no-undef only adds false alarms.
    files: ["**/*.astro"],
    rules: { "no-undef": "off" },
  },
  {
    // Node scripts, such as the contrast check. Listed here instead of
    // installing the "globals" package for two names.
    files: ["scripts/**/*.mjs"],
    languageOptions: { globals: { process: "readonly", console: "readonly" } },
  },
]);
