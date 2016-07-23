module.exports = {
  entry: './src/entry.js',
  output: {
    path: __dirname,
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'Q'
  },
  externals: {
    'ractive': 'Ractive',
    'gojs': 'go'
  },
  devtool: 'source-map'
}