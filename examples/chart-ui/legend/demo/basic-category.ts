import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Category } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 200,
  renderer,
});

const items = [
  { name: 'Chrome', value: '7.08%' },
  { name: 'IE', value: '5.41%' },
  { name: 'QQ', value: '5.35%' },
  { name: 'Firefox', value: '1.23%' },
  { name: 'Microsoft Edge', value: '3.51%' },
  { name: '360', value: '2.59%' },
  { name: 'Opera', value: '0.87%' },
  { name: 'Sogou', value: '1.06%' },
  { name: 'Others', value: '0.59%' },
].map(({ name, value }) => {
  return { name, value, id: name, state: 'selected' };
});

const category = new Category({
  style: {
    x: 10,
    y: 10,
    items,
    title: {
      content: '基本分类图例',
    },
    spacing: [10, 10],
    maxItemWidth: 160,
  },
});

canvas.appendChild(category);

const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const styleFolder = cfg.addFolder('样式');
styleFolder.open();
const categoryCfg = {
  图标颜色: '#d3d2d3',
  图标形状: 'circle',
  图标大小: 8,
  项颜色: '#646464',
  项大小: 12,
  值颜色: '#646464',
  值大小: 12,
};

styleFolder.addColor(categoryCfg, '图标颜色').onChange((color) => {
  category.update({ itemMarker: { style: { selected: { fill: color } } } });
});
styleFolder.add(categoryCfg, '图标形状', ['circle', 'diamond', 'triangle', 'square']).onChange((shape) => {
  category.update({ itemMarker: { marker: shape } });
});
styleFolder.add(categoryCfg, '图标大小', 0, 20).onChange((size) => {
  category.update({ itemMarker: { size } });
});
styleFolder.addColor(categoryCfg, '项颜色').onChange((color) => {
  category.update({ itemName: { style: { selected: { fill: color } } } });
});
styleFolder.add(categoryCfg, '项大小', 0, 20).onChange((size) => {
  category.update({
    itemName: { style: { default: { fontSize: size }, selected: { fontSize: size } } },
  });
});
styleFolder.addColor(categoryCfg, '值颜色').onChange((color) => {
  category.update({ itemValue: { style: { selected: { fill: color } } } });
});
styleFolder.add(categoryCfg, '值大小', 0, 20).onChange((size) => {
  category.update({
    itemValue: { style: { default: { fontSize: size }, selected: { fontSize: size } } },
  });
});

const options = cfg.addFolder('选项');
options.open();

const stateMap = { selected: true, default: false, true: 'selected', false: 'default' };
const itemsState = {};
items.forEach(({ id, state }) => {
  itemsState[id] = options.add({ [id]: stateMap[state] }, id).onChange((state) => {
    category.setItemState(id, stateMap[state]);
  });
});
category.addEventListener('valueChanged', ({ detail: { value } }) => {
  value.forEach(({ id, state }) => {
    itemsState[id].setValue(stateMap[state]);
  });
});
