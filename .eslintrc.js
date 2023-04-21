module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    // add project-specific rules here
    "@typescript-eslint/no-implicit-any-catch": ["error", { "allowExplicitAny": true }],
    "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            ["parent", "sibling"],
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
  },
};
