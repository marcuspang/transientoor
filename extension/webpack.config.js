const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  mode: "production",
  entry: {
    background: path.resolve(__dirname, "./src/background.ts"),
    inject: path.resolve(__dirname, "./src/inject.ts"),
  },
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "[name].js",
    sourceMapFilename: "[name].js.map",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "source-map",
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }],
    }),
  ],
};
