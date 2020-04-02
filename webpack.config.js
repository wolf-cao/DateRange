const path = require('path')
const pxtorem = require('postcss-pxtorem')
const autoprefixer = require('autoprefixer')
const CompressionPlugin = require('compression-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionPlugin(),
    new UglifyJSPlugin({
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    })
  ],
  resolve: {
    alias: {
      react: 'react/cjs/react.production.min.js',
      'react-dom': 'react-dom/cjs/react-dom.production.min.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(css|less)$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1
            }
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                pxtorem({
                  rootValue: 100,
                  propWhiteList: []
                }),
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: ['iOS >= 9', 'Android >= 4', '>1%'],
                  flexbox: true
                })
              ]
            }
          },
          {
            loader: 'less-loader',
            options: { javascriptEnabled: true }
          }
        ]
      }
    ]
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'React',
      commonjs: 'React',
      amd: 'React'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'ReactDOM',
      commonjs: 'ReactDOM',
      amd: 'ReactDOM'
    }
  }
}
