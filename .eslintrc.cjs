module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  "ignorePatterns": [".eslintrc.cjs", "cjs/**/*", "esm/**/*"],
  "rules": {
    "no-extra-semi": "off",
    "@typescript-eslint/no-extra-semi": ["off"],
    "semi": "off",
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/no-explicit-any": ["off", { "ignoreRestArgs": false }],
    },
  "overrides": [
    {
      "files": [ "src/**/*.ts" ],
    },
  ],
  root: true,
};
