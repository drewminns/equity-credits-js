const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const dist = path.join(__dirname, "dist");

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
          { loader: 'style-loader', options: { injectType: 'singletonStyleTag' } },
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
          { loader: 'style-loader', options: { injectType: 'singletonStyleTag' } },
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
    })]
  }
};