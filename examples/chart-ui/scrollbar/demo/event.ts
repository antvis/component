import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Scrollbar } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const scrollbar = new Scrollbar({
  style: {
    x: 5,
    y: 20,
    orient: 'vertical',
    value: 0.5,
    width: 10,
    height: 200,
    thumbLen: 30,
  },
});

canvas.appendChild(scrollbar);

/** 事件监听 */
scrollbar.addEventListener('valueChanged', ({ detail: { value } }) => {
  cfgValue.setValue(value);
});

/** -------------------------配置区域--------------------------------------- */
const cfg = new dat.GUI({ autoPlace: false });
document.getElementById('container').appendChild(cfg.domElement);
const cfgValue = cfg
  .add({ value: 0.5 }, 'value', 0, 1)
  .step(0.01)
  .onChange((value) => {
    scrollbar.setValue(value);
  });
