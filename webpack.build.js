const path = require("path");
const webpack = require("webpack");

const dist = path.join(__dirname, "dist");

const IS_DEMO = process.env.DEMO;

module.exports = {
  entry: ["./src/index.ts"],
  output: {
    filename: "index.js",
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
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
        ENDPOINT: JSON.stringify(
          IS_DEMO ? "https://upcoming9.shopify.com/independents.json" : 'https://shopify.com/independents.json'
        )
      }
    })
  ]
};
