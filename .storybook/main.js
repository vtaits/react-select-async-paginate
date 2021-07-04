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
                firefox: '89',
                chrome: '91',
              },
            },
          ],

          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
            },
          ],
        ],

        plugins: [
          // https://github.com/babel/babel/issues/10261
          ['@babel/plugin-transform-runtime', {
            version: '7.12.5',
          }],
        ],
      },
    });

    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },
};
