const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");


module.exports = {
  extends: [
    "plugin:storybook/recommended",
    "plugin:mdx/recommended"    
  ],
  parserOptions: {
    project,
  },
  plugins: ["only-warn"],
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/"],
  // add rules configurations here
  rules: {
    "import/no-default-export": "off",
  },
};