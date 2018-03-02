const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const HappyPack = require('happypack')
// const os = require('os')
// const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const IS_DEV = process.env.NODE_ENV === 'development'
const ROOT_PATH = path.resolve(__dirname, '../')
const SRC_PATH = path.resolve(ROOT_PATH, 'src')
const BUILD_PATH = IS_DEV ? path.resolve(ROOT_PATH, '../nextCloudLib-dev/node-debug-webapp/webapp/public') : path.resolve(ROOT_PATH, 'public')
const JS_NAME = IS_DEV ? 'js/[name].js' : 'js/[name].[chunkhash:8].js'
const CSS_NAME = IS_DEV ? 'css/[name].css' : 'css/[name].[contenthash:8].css'
const LESS_NAME = IS_DEV ? '[name]_[local]_[hash:base64:4]' : '[hash:base64:8]'
module.exports = {
  stats: {
    chunks: false,
    children: false
  },
  entry: {
    lib: ['react', 'react-dom', 'react-router', 'immutable', 'redux', 'react-redux', 'whatwg-fetch', 'es6-promise-polyfill',
          'lodash', 'rc-dialog', 'babel-polyfill', 'react-bodymovin', 'moment', 'zrender', 'expr-eval', 'postal'],
    'mobile-app': path.resolve(SRC_PATH, 'mobileEntry.js'),
    'web-app': path.resolve(SRC_PATH, 'webEntry.js')
  },
  output: {
    path: path.resolve(BUILD_PATH),
    filename: JS_NAME,
    publicPath: './public/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    // new HappyPack({
    //   id: 'jsx',
    //   threadPool: happyThreadPool,
    //   loaders: [ 'babel-loader' ]
    // }),
    new webpack.optimize.CommonsChunkPlugin({name: 'lib', minChunks: Infinity}),
    new ExtractTextPlugin(CSS_NAME, {allChunks: true})
  ],
  module: {
    rules: [
      // {
      //   test: /\.jsx?$/,
      //   loaders: ['eslint-loader'],
      //   include: SRC_PATH,
      //   enforce: 'pre'
      // },
      {
        test: /\.(js|jsx)$/,
        // loaders: [ 'happypack/loader?id=jsx' ],
        loaders: [ 'babel-loader' ],
        include: SRC_PATH,
        exclude: path.resolve(ROOT_PATH, 'node_modules')
      }, {
        test: /(\.css|\.less)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: true,
              modules: true,
              localIdentName: LESS_NAME,
              minimize: !IS_DEV
            }
          },
            'postcss-loader',
            'less-loader'
          ],
          publicPath: path.resolve(BUILD_PATH, 'css')
        })
      }, {
        test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
        use: ['url-loader']
      }, {
        test: /\.(png|jpe?g|gif)$/,
        use: ['url-loader?limit=10240&name=img/[hash:8].[name].[ext]']
      }, {
        test: /\.json$/,
        use: ['json-loader']
      }
    ]
  }
}
