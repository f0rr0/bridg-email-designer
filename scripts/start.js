/* eslint-disable */
import { resolve } from 'path';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import config from '../webpack.config.dev.babel.js';
import { open } from 'openurl';

new webpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  contentBase: resolve(__dirname, '../public'),
  quiet: true,
  watchOptions: {
    ignored: /node_modules/
  },
  historyApiFallback: true
}).listen(8000, 'localhost', (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:8000/');
  open('http://localhost:8000/');
});
