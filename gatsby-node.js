exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({ name: 'babel-preset-gatsby', options: {} });
  actions.setBabelPlugin({ name: 'babel-plugin-transform-class-properties', options: { loose: true } });
};
