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

const cfg = new dat.GUI({ autoPlace: false });
document.getElementById('container').appendChild(cfg.domElement);
const folder = cfg.addFolder('配置项');
folder.open();

const schema = [
  { attribute: 'width', label: '宽度', range: [10, 300] },
  { attribute: 'height', label: '高度', range: [10, 300] },
  { attribute: 'orient', label: '方向', options: ['horizontal', 'vertical'] },
  { attribute: 'value', label: '值', range: [0, 1] },
  { attribute: 'isRound', label: '圆角', options: ['true', 'false'] },
  { attribute: 'thumbLen', label: '滑块长度', range: [10, 50] },
  { attribute: 'padding', label: '内边距', range: [0, 5] },
];
const scrollbarCfg = {};
schema.forEach((cfg) => {
  const value = scrollbar.attributes[cfg.attribute];
  scrollbarCfg[cfg.label] = Array.isArray(value) ? value[0] : value;
});

let datGUIWidth, datGUIHeight;
schema.forEach((cfg) => {
  const result = folder.add(scrollbarCfg, cfg.label, ...(cfg.range || []), cfg.options).onChange((v) => {
    const value = cfg.attribute === 'isRound' ? v === 'true' : v;
    if (cfg.attribute === 'orient') {
      const w = datGUIWidth.getValue();
      const h = datGUIHeight.getValue();
      datGUIWidth.setValue(h);
      datGUIHeight.setValue(w);
    }
    scrollbar.update({ [cfg.attribute]: value });
  });
  if (cfg.attribute === 'width') {
    datGUIWidth = result;
  }
  if (cfg.attribute === 'height') {
    datGUIHeight = result;
  }
});
