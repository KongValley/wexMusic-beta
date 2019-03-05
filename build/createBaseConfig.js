const webpack = require('webpack');
const { pagesEntry } = require('@megalo/entry')
const createMegaloTarget = require('@megalo/target')
const compiler = require('@megalo/template-compiler')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const _ = require( './util' );
const appMainFile = _.resolve('src/app.js')
const CSS_EXT = {
  wechat: 'wxss',
  alipay: 'acss',
  swan: 'css',
};

const px2rpxLoader = {
  loader: '@megalo/px2rpx-loader',
  options: {
    rpxUnit: 0.5
  }
}

const cssLoaders = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  px2rpxLoader
]

function createBaseConfig( platform = 'wechat' ) {
  const cssExt = CSS_EXT[platform]
  
  return {
    mode: 'development',

    target: createMegaloTarget( {
      compiler: Object.assign( compiler, { } ),
      platform,
      htmlParse: {
        templateName: 'octoParse',
        src: _.resolve(`./node_modules/octoparse/lib/platform/${platform}`)
      },
    } ),

    entry: {
      'app': appMainFile,
      ...pagesEntry(appMainFile)
    },

    output: {
      path: _.resolve(`dist-${platform}/`),
      filename: 'static/js/[name].js',
      chunkFilename: 'static/js/[id].js'
    },

    devServer: {
      // hot: true,
    },

    optimization: {
      runtimeChunk: {
        name: 'runtime'
      },
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      }
    },

    // devtool: 'cheap-source-map',
    devtool: false,

    resolve: {
      extensions: ['.vue', '.js', '.json'],
      alias: {
        'vue': 'megalo',
        '@': _.resolve('src'),
        '_p': _.resolve('src/pages'),
        '_c': _.resolve('src/components'),
        '_s': _.resolve('src/style'),
        '_u': _.resolve('src/utils'),
        '_a': _.resolve('src/api'),
        '_v': _.resolve('src/static/iview')
      },
    },

    module: {
      rules: [
        // ... other rules
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {}
            }
          ]
        },
        {
          test: /\.js$/,
          use: 'babel-loader'
        },

        {
          test: /\.css$/,
          use: cssLoaders
        },

        {
          test: /\.scss$/,
          use: [
            ...cssLoaders,
            'sass-loader',
          ]
        },

      ]
    },

    plugins: [
      new VueLoaderPlugin(),
      new webpack.ProvidePlugin({
        'Megalo': [_.resolve(`./node_modules/@megalo/api/platforms/${platform}`), 'default']
      }),
      new MiniCssExtractPlugin({
        filename: `./static/css/[name].${cssExt}`,
      }),
      new CopyWebpackPlugin([{
        from: 'src/static/iview', to: 'static/iview',
        from: 'src/static/imgs', to: 'static/imgs',
        from: 'src/static/vant', to: 'static/vant'
      }])
    ],
    stats:{
      env: true,
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      entrypoints: false,
    }
  }
}

module.exports = createBaseConfig
