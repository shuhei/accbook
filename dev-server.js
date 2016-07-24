/* eslint-env node */
/* eslint no-console: "off" */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.dev.config');

new WebpackDevServer(webpack(config), {
  hot: true,
  historyApiFallback: true,
  contentBase: './public',
}).listen(3000, 'localhost', err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at localhost:3000');
});
