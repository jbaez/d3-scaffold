const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    library: 'd3-scaffold',
    libraryTarget: 'umd',
    filename: 'd3-scaffold.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimize: true
  },
  externals: {
    d3: 'd3'
  },
  mode: 'production'
};
