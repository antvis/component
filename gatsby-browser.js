window.gui = require('./src/index.ts');
window.gCanvas = require('@antv/g-canvas');
window.gSvg = require('@antv/g-svg');
window.g = require('@antv/g');
window.util = require('@antv/util');
window.scale = require('@antv/scale');
window.reactDom = require('react-dom');
window.dat = require('dat.gui');

/**
 * Usage:
 *   ConfigPanel(axis, '样式', {
 *      'label.autoHide': { label: '自动隐藏', value: false },
 *      'axisLine.style.stroke': { label: '轴线颜色', value: '#000', type: 'color' },
 *      'tickLine.len': { label: '刻度长度', value: 6, type: 'number', step: 1, range: [0, 9],  },
 *   });
 */
window.ConfigPanel = (instance, title, cfg, guiCfg) => {
  const instances = Array.isArray(instance) ? instance : [instance];
  const $wrapper = document.getElementById('container');
  const datGUI = new dat.GUI({ autoPlace: true, closeOnTop: true, ...(guiCfg || {}) });
  $wrapper.appendChild(datGUI.domElement);
  const styleFolder = datGUI.addFolder(title);
  styleFolder.open();

  const styleCfg = Object.keys(cfg).reduce((r, key) => {
    const d = cfg[key];
    r[d.label] = d.value;
    return r;
  }, {});
  Object.keys(cfg).forEach((key) => {
    const d = cfg[key];
    const range = d.range || [];
    if (d.type === 'color') {
      styleFolder.addColor(styleCfg, d.label).onChange((value) => {
        instances.forEach((d) => d.update(util.set({}, key, value)));
      });
    } else if (d.type === 'number') {
      styleFolder
        .add(styleCfg, d.label, range[0], range[1])
        .step(d.step || 1)
        .onChange((value) => {
          instances.forEach((d) => d.update(util.set({}, key, value)));
        });
    } else {
      const options = d.options ? d.options.map((d) => (typeof d !== 'object' ? { name: d, value: d } : d)) : [];
      const guiOptions = d.options && options.map((d) => d.name);
      styleFolder.add(styleCfg, d.label, guiOptions).onChange((value) => {
        const option = options.find((d) => d.name === value);
        instances.forEach((d) => d.update(util.set({}, key, option ? option.value : value)));
      });
    }
  });
};
