const path = require('path');

const context = path.join(__dirname, 'examples');

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
      }],
    }],
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    alias: {
      'react-select-async-paginate': path.join(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx'],
  },
};
