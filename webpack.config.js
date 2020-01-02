const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const dist = path.join(__dirname, "demo");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: ["babel-polyfill", "./src/index.ts"],
  output: {
    filename: "[name].[hash].js",
    path: dist
  },
  devtool: isProd ? "eval" : "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.css$/i,
        include: /node_modules/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        loader: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true
            }
          },
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: !isProd
            }
          },
        ]
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      }
    ]
  },
  devServer: {
    port: 3000
  },
  resolve: {
    extensions: [".ts", ".js", ".scss"]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        ENDPOINT: JSON.stringify(process.env.ENDPOINT)
      }
    }),
    new HTMLWebpackPlugin({
      template: "./config/index.html"
    })
  ]
};
