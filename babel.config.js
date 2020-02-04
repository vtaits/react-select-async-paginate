

module.exports = {
  env: {
    cjs: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
    },

    es: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
          },
        ],
        '@babel/preset-react',
      ],
    },

    test: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
    },
  },

  plugins: [
    // https://github.com/babel/babel/issues/10261
    ['@babel/plugin-transform-runtime', {
      version: require('@babel/helpers/package.json').version,
    }],
    '@babel/plugin-proposal-class-properties',
  ],
};
