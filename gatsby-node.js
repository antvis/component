exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({ name: 'babel-preset-gatsby', options: { targets: { browsers: ['>0.25%', 'not dead'] } } });
  actions.setBabelPreset({
    name: '@babel/preset-env',
    options: {
      targets: '> 0.25%, not dead',
    },
  });
  actions.setBabelPlugin({ name: '@babel/plugin-proposal-decorators', options: { legacy: true } });
};
