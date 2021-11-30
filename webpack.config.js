module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    library: 'GUI',
    libraryTarget: 'umd',
    filename: 'gui.min.js',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  externals: {
    '@antv/g': {
      commonjs: '@antv/g',
      commonjs2: '@antv/g',
      amd: '@antv/g',
      root: 'G',
    },
  },
};
