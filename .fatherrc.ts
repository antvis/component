export default {
  esm: 'rollup',
  cjs: 'rollup',
  umd: false,
  nodeResolveOpts: {
    mainFields: ['module', 'browser', 'main'],
  },
};
