const BABEL_OPTIONS = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead',
      },
    ],
  ],
  plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
};

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
            options: BABEL_OPTIONS,
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
      {
        test: /\.js$/,
        /** bable 只需要处理 node_modules 中的 es6 模块，src 中的交给 ts-loader 即可 */
        include: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: BABEL_OPTIONS,
        },
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
