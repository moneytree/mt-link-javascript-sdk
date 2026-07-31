const { defineConfig } = require('eslint/config');

const tsParser = require('@typescript-eslint/parser');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const js = require('@eslint/js');
const globals = require('globals');

module.exports = defineConfig([
  {
    ignores: [
      '**/dist',
      '**/docs',
      '**/coverage',
      'webpack.config.js',
      'sample/webpack.config.js',
      'eslint.config.js',
      'jest.config.js'
    ]
  },
  js.configs.recommended,
  typescriptEslint.configs['flat/recommended'],
  {
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      },
      ecmaVersion: 11,
      parserOptions: {}
    },

    plugins: {
      '@typescript-eslint': typescriptEslint
    },

    rules: {
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description'
        }
      ]
    }
  }
]);
