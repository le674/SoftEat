const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const webpack = require('webpack');
module.exports = {
  entry: {
    main:'./src/main.ts'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      }      
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
        "process": require.resolve("process/browser"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert/")
    }
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
};

