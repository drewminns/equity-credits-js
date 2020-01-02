module.exports = {
  extends: ["airbnb", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"]
    },
    "import/resolver": {
      typescript: {}
    }
  },
  "env": {
    "browser": true
  },
  rules: {
    "import/no-extraneous-dependencies": [
      2,
      { devDependencies: ["**/test.tsx", "**/test.ts"] }
    ],
    "import/prefer-default-export": "off",
    "import/extensions": [0, "never"],
    "@typescript-eslint/indent": [2, 2]
  }
};
