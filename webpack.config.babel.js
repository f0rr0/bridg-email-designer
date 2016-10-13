/* eslint-disable */
import { resolve } from 'path';
import { HotModuleReplacementPlugin, DefinePlugin, optimize } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import DashboardPlugin from 'webpack-dashboard/plugin';
import CopyPlugin from 'copy-webpack-plugin';

const devConfig = {
  context: resolve(__dirname, './src'),
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server',
    './index.jsx'
  ],
  output: {
    path: resolve(__dirname, './build'),
    pathinfo: true,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: resolve(__dirname, './public/index.html')
    }),
    new DashboardPlugin()
  ],
  devServer: {
    contentBase: resolve(__dirname, '/public'),
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: true,
    clientLogLevel: 'none',
    quiet: true
  }
};

const prodConfig = Object.assign({}, devConfig, {
  devtool: 'source-map',
  entry: './index.jsx',
  plugins: [
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: resolve(__dirname, './public/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    new CopyPlugin([
      { from: resolve(__dirname, './public/'), force: true }
    ], {
      ignore: [
        'index.html'
      ]
    })
  ]
});

export default (env = { dev: true }) => {
  if (env.dev) {
    return devConfig;
  } else {
    return prodConfig;
  }
}
