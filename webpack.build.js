const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const dist = path.join(__dirname, "dist");

const IS_DEMO = process.env.DEMO;

module.exports = {
  entry: ["./src/index.ts"],
  output: {
    filename: "index.js",
    path: dist,
    library: 'Independents',
    libraryTarget: "commonjs2",
    libraryExport: "default"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.css$/i,
        include: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
        ]
      },
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        loader: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          "sass-loader",
          {
            loader: "sass-resources-loader",
            options: {
              resources: [
                "./src/styles/_variables.scss",
                "./src/styles/_queries.scss",
                "./src/styles/_grid.scss"
              ]
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", "scss"]
  },
  optimization: {
    minimize: true,
    minimizer: [ new TerserPlugin({
      cache: true,
      parallel: true,
      terserOptions: {
        output: {
          comments: false
        }
      }
    }),
    new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
        ENDPOINT: JSON.stringify('https://www.shopify.com/independents.json')
      }
    }),
    new MiniCssExtractPlugin({
      filename: `main.css`
    }),
  ]
};