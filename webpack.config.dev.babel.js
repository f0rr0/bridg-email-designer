/* eslint-disable */
import { resolve } from 'path';
import { HotModuleReplacementPlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  context: resolve(__dirname, './src'),
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:8000',
    'webpack/hot/dev-server',
    './index.jsx'
  ],
  output: {
    path: resolve(__dirname, './build'),
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: resolve(__dirname, './public/index.html'),
    })
  ]
};
