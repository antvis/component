import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Scrollbar } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const scrollbar = new Scrollbar({
  style: {
    x: 5,
    y: 5,
    orient: 'vertical',
    value: 0.5,
    width: 10,
    height: 200,
    isRound: false,
    thumbLen: 30,
  },
});

canvas.appendChild(scrollbar);

const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const folder = cfg.addFolder('配置项');
folder.open();
const scrollbarCfg = {
  x: 5,
  y: 50,
  方向: 'vertical',
  值: 0.5,
  宽度: 200,
  高度: 10,
  圆角: false,
  滑块长度: 30,
  内边距: 1,
};
const width = folder.add(scrollbarCfg, '宽度', 10, 300).onChange((width) => {
  scrollbar.update({ width });
});
const height = folder.add(scrollbarCfg, '高度', 10, 300).onChange((height) => {
  scrollbar.update({ height });
});
folder.add(scrollbarCfg, '方向', ['horizontal', 'vertical']).onChange((orient) => {
  const w = width.getValue();
  const h = height.getValue();
  width.setValue(h);
  height.setValue(w);
  scrollbar.update({ orient });
});
const value = folder.add(scrollbarCfg, '值', 0, 1).onChange((value) => {
  scrollbar.update({ value });
});
folder.add(scrollbarCfg, '圆角', ['true', 'false']).onChange((isRound) => {
  scrollbar.update({ isRound: isRound === 'true' });
});
folder.add(scrollbarCfg, '滑块长度', 10, 50).onChange((thumbLen) => {
  scrollbar.update({ thumbLen });
});
folder.add(scrollbarCfg, '内边距', 0, 5).onChange((padding) => {
  scrollbar.update({ padding });
});

/** event listener */
scrollbar.addEventListener('valueChanged', ({ detail }) => {
  value.setValue(detail.value);
});
