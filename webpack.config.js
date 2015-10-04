/* eslint-env node */
'use strict';

var path = require('path');
var webpack = require('webpack');
var dotenv = require('dotenv');
dotenv.load();

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.DefinePlugin({
      PARSE_APP_ID: JSON.stringify(process.env.PARSE_APP_ID),
      PARSE_JS_API_KEY: JSON.stringify(process.env.PARSE_JS_API_KEY)
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src')
      }
    ]
  }
};
