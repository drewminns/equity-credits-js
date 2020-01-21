const path = require("path");
const webpack = require("webpack");

const dist = path.join(__dirname, "dist");

const IS_DEMO = process.env.DEMO;

module.exports = {
  entry: ["./src/index.ts"],
  output: {
    filename: "index.js",
    library: 'independents',
    path: dist
  },
  devtool: "none",
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
  devServer: {
    port: 3000
  },
  resolve: {
    extensions: [".ts", ".js", "scss"]
  },
  externals: {
    axios: 'axios',
    animejs: 'animejs',
    debounce: 'lodash.debounce',
    throttle: 'lodash.throttle',
    scrollmagic: 'scrollmagic',
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
        ENDPOINT: JSON.stringify('https://www.shopify.com/independents.json')
      }
    })
  ]
};
