import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import importPlugin from 'eslint-plugin-import'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },

    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // react
            ['^react$'],

            // antd
            ['^antd', '^@ant-design'],

            // reatom
            ['^@reatom'],

            // остальные библиотеки
            ['^@?\\w'],

            // fsd layers
            ['^\\$app'],
            ['^\\$pages'],
            ['^\\$widgets'],
            ['^\\$features'],
            ['^\\$entities'],
            ['^\\$shared'],

            // relative imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],

            // styles
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/no-cycle': 'error',
    },
  },
])