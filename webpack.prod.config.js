/* eslint-env node */
'use strict';

var path = require('path');
var webpack = require('webpack');
var dotenv = require('dotenv');
dotenv.load();

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      PARSE_APP_ID: JSON.stringify(process.env.PARSE_APP_ID),
      PARSE_JS_API_KEY: JSON.stringify(process.env.PARSE_JS_API_KEY)
    })
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ]
  }
};