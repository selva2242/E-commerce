const path = require("path");
const webpackplugin = require("html-webpack-plugin");

const config = {
  mode: "development",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "build.js",
    clean : true,
  },
  plugins : [new webpackplugin()],
};

module.exports = config;
