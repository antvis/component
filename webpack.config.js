module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    library: 'GUI',
    libraryTarget: 'umd',
    filename: 'gui.min.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              // 可以提高构建速度。缺点：没有进行类型编译检查。
              transpileOnly: true,
            },
          },
        ],
      },
    ],
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
