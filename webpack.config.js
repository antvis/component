const path = require('path');

const BABEL_OPTIONS = {
  plugins: [
    [
      '@babel/transform-runtime',
      {
        helpers: false,
        regenerator: true,
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead',
      },
    ],
  ],
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
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
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
        test: /\.js?$/,
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
