const path = require('path');

const context = path.join(__dirname, 'src');

module.exports = {
  mode: 'development',
  context,
  entry: './index.jsx',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: [/\.js$/, /\.jsx$/],
      exclude: /(node_modules|dist)/,
      use: [{
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            ['env', { modules: false }],
            'react',
            'stage-2',
          ],
          plugins: [],
        },
      }],
    }],
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
  },
};
