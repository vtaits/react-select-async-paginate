module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'airbnb'],
  parser: 'babel-eslint',

  plugins: [
    'react',
    'jest',
  ],

  rules: {
    'arrow-parens': ['error', 'always'],
    'react/no-did-update-set-state': 'off',
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',

    'import/no-extraneous-dependencies': [
      'error',
      {
        packageDir: [
          './',
          './examples',
          './packages/react-select-async-paginate',
        ],

        devDependencies: [
          '**/__tests__/**/*',
          '**/__stories__/**/*',
        ],
      },
    ],

    /* provide all props to react-select and its components */
    'react/jsx-props-no-spreading': 'off',
  },
};
