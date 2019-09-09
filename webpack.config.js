const webpack = require('webpack');
const resolve = require('path').resolve;
const SizePlugin = require('size-plugin');
module.exports = {
  devtool: 'cheap-source-map',
  mode: 'production',
  entry: {
    component: './src/index.js'
  },
  output: {
    filename: '[name].js',
    library: 'component',
    libraryTarget: 'umd',
    path: resolve(__dirname, 'build/')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true
          }
        }
      }
    ]
  },
  plugins: [
    new SizePlugin({ publish: true }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
};
