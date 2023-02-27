module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "next/core-web-vitals",
    "prettier",
  ],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@typescript-eslint/strict",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "next/core-web-vitals",
        "prettier",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      settings: {
        "import/resolver": {
          typescript: true,
          node: true,
        },
      },
    },
  ],
};
