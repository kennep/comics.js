const path = require('path');

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, "client"),
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, 'build/dist/public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ["@babel/env", "@babel/react"]
        }
      }
    ],
  },
  devtool: 'source-map',
  optimization: {
    minimize: true
  },
};
