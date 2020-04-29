module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  plugins: [
    'react',
    'jest',
    '@typescript-eslint',
  ],

  parserOptions: {
    project: './tsconfig.validate.json',
  },

  settings: {
    'import/resolver': {
      typescript: {},
    },
  },

  rules: {
    'arrow-parens': ['error', 'always'],
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',

    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/__tests__/**/*',
          '**/__stories__/**/*',
        ],
      },
    ],

    /* provide all props to react-select and its components */
    'react/jsx-props-no-spreading': 'off',

    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    '@typescript-eslint/no-explicit-any': 'off',
  },
};
