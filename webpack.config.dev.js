const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = () => {
  const env = dotenv.config().parsed;

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    context: __dirname,
    entry: './src/index.js',
    mode: 'development',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, './build'),
      filename: 'chunk.[contenthash].js',
      publicPath: '/',
    },
    devServer: {
      historyApiFallback: true,
    },
    module: {
      rules: [
        { test: /\.(js)$/, use: 'babel-loader', exclude: /node_modules/ },
        {
          test: /\.(woff(2)?|otf|ttf|eot|svg|png)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/',
              },
            },
          ],
        },
        {
          test: /\.(s*)css$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        filename: 'index.html',
        favicon: path.resolve(__dirname, 'public/favicon.ico'),
      }),
      new webpack.DefinePlugin(envKeys),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
      new CleanWebpackPlugin(),
    ],
  };
};
