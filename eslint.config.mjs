import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import checkFile from 'eslint-plugin-check-file';
import _import from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: compat.extends(
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'plugin:prettier/recommended'
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
      react,
      import: fixupPluginRules(_import),
      'unused-imports': unusedImports,
      'check-file': checkFile,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.tsx': 'PASCAL_CASE',
          '**/*.ts': 'KEBAB_CASE',
          '**/*.js': 'KEBAB_CASE',
          '**/*.jsx': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],

      'check-file/folder-naming-convention': [
        'warn',
        {
          'src/**/!(__tests__|__test-helpers__)/': 'SNAKE_CASE',
        },
      ],

      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'error',

      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.tsx'],
        },
      ],

      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',

      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
        },
      ],

      'max-len': [
        'warn',
        {
          code: 100,
          ignoreComments: true,
          ignoreUrls: true,
          ignorePattern: '^import\\s.+\\sfrom\\s.+$',
        },
      ],

      'import/prefer-default-export': 'off',
      'react/prop-types': 'off',

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],

      'react/react-in-jsx-scope': 'off',

      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal'],

          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],

          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
        },
      ],

      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
    },
  },
  {
    files: ['**/use[A-Z]*.tsx', '**/use[A-Z]*.tsx', '**/use[A-Z]*.ts', '**/use[A-Z]*.ts'],

    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.tsx': 'CAMEL_CASE',
          '**/*.ts': 'CAMEL_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
  {
    files: [
      '**/*IAM*.tsx',
      '**/*IAM*.tsx',
      '**/*ARN*.tsx',
      '**/*ARN*.tsx',
      '**/index.tsx',
      '**/index.tsx',
    ],

    rules: {
      'check-file/filename-naming-convention': 'off',
    },
  },
]);
