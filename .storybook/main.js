module.exports = {
  stories: ['../packages/**/*.stories.tsx'],

  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          '@babel/preset-typescript',
          [
            '@babel/env', {
              modules: false,

              targets: {
                firefox: '64',
                chrome: '71',
              },
            },
          ],
          '@babel/react',
        ],

        plugins: [
          // https://github.com/babel/babel/issues/10261
          ['@babel/plugin-transform-runtime', {
            version: require('@babel/helpers/package.json').version,
          }],
        ],
      },
    });

    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },
};
