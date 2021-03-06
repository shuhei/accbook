const path = require('path');

module.exports = {
  entry: {
    app: [
      './src/index.js'
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.(css|scss)$/,
        loaders: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.html$/,
        loaders: [
          'file?name=[name].[ext]'
        ]
      },
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        loader: 'elm-webpack'
      }
    ],
    noParse: /\.elm$/
  },

  devServer: {
    inline: true,
    stats: {
      colors: true
    }
  }
};
