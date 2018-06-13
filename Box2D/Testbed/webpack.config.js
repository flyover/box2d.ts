// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'none',
  // entry: './test.ts',
  entry: './dist/Testbed/Testbed.js',
  // module: {
  //   rules: [
  //     {
  //       test: /\.tsx?$/,
  //       use: 'ts-loader',
  //       exclude: /node_modules/
  //     }
  //   ]
  // },
  // resolve: {
    // plugins: [new TsconfigPathsPlugin({ /*configFile: "./path/to/tsconfig.json" */ })],
    // extensions: [ '.tsx', '.ts', '.js' ]
  // },
  resolve: {
    alias: {
      Box2D$: path.resolve(__dirname, 'dist/Box2D/Box2D.js'),
      Box2D: path.resolve(__dirname, 'dist/Box2D/'),
      Testbed$: path.resolve(__dirname, 'dist/Testbed/Testbed.js'),
      Testbed: path.resolve(__dirname, 'dist/Testbed/'),
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
