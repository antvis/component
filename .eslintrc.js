module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    semi: 'error',
    'no-unused-vars': 'off',
    'no-return-assign': 'off',
    'no-sequences': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'warn',
    'no-restricted-syntax': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'object-curly-newline': 'off',
    'class-methods-use-this': 'off',
    'no-shadow': 'off',
    'no-console': 'off',
    'arrow-body-style': 'off',
    'no-useless-constructor': 'off',
    'no-unused-expressions': 'off',
    'no-dupe-class-members': 'off',
    'prefer-destructuring': 'off',
    'no-underscore-dangle': 'off',
    'no-compare-neg-zero': 'off',
    '@typescript-eslint/no-dupe-class-members': ['error'],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
