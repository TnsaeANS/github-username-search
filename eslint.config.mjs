// eslint.config.js  (root)
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat();

export default [
  ...compat.config({
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      // no-unused-vars-experimental was deprecated; remove or keep 'off'
      'no-unused-vars': 'off',
    },
  }),
  // any Next.js presets already added by create-next-app
  ...tseslint.configs.recommended[0],
];
