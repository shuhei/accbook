var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev.config');

new WebpackDevServer(webpack(config), {
  hot: true,
  historyApiFallback: true,
  contentBase: './public'
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at localhost:3000');
});
