var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = function(env) {
  if (env === 'production') {
    var plugins = [
      new webpack.DefinePlugin({
        'process.env': require('./../env').prod
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        sourceMap: true
      }),
      // extract css into its own file
      // new ExtractTextPlugin({
      //   filename: utils.assetsPath('css/[name].[contenthash].css')
      // }),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      // new OptimizeCSSPlugin(),
      // generate dist index.html with correct asset hash for caching.
      // you can customize output by editing /index.html
      // see https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: resolve('index.html'),
        inject: true,
        minify: {
          removeComments: false,
          collapseWhitespace: false,
          removeAttributeQuotes: false
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        }
      })
    ];
  } else if (env === 'unminified') {
    var plugins = [
      new webpack.DefinePlugin({
        'process.env': require('./../env').prod
      }),
      new HtmlWebpackPlugin({
        filename: 'unminified.html',
        template: resolve('index.html'),
        inject: true,
        minify: {
          removeComments: false,
          collapseWhitespace: false,
          removeAttributeQuotes: false
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        }
      })
    ];
  } else {
    var plugins = [
      new webpack.DefinePlugin({
        'process.env': require('./../env').dev
      }),
      // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: resolve('index.html'),
        inject: true
      }),
      new FriendlyErrorsPlugin()
    ];
  }
  return {
    entry: {
      app: resolve('src/main.js')
    },
    devtool: env !== 'production' && env !== 'unminified' ? '#cheap-module-eval-source-map' : '#source-map',
    output: {
      path: resolve('lib'),
      publicPath: '/',
      filename: env === 'production' ? '[name].min.js' : '[name].js',
      library: 'KundanForm',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    module: {
    rules: [
        {
          test: /\.js$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [resolve('src'), resolve('test')],
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src'), resolve('test')]
        },
        {
          test: /\.styl$/,
          use: [
            'style-loader',
            'css-loader',
            'stylus-loader',
          ]
        }
      ]
    },
    plugins: plugins
  };
};