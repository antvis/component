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
    thumbLen: 30,
    trackStyle: {
      default: {
        lineWidth: 3,
        stroke: 'pink',
        radius: 5,
      },
    },
    thumbStyle: {
      default: {
        fill: 'pink',
        opacity: 1,
      },
      active: {
        fill: 'pink',
        opacity: 0.5,
      },
    },
  },
});

canvas.appendChild(scrollbar);

const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const track = cfg.addFolder('滑轨');
track.open();
const trackCfg = {
  边框颜色: '#f5c2cb',
  圆角半径: 5,
  边框宽度: 3,
  激活状态颜色: '#f5c2cb',
};
track.addColor(trackCfg, '边框颜色').onChange((color) => {
  scrollbar.update({ trackStyle: { default: { stroke: color } } });
});
track.add(trackCfg, '边框宽度', 1, 5).onChange((lineWidth) => {
  scrollbar.update({ trackStyle: { default: { lineWidth } } });
});
track.add(trackCfg, '圆角半径', 1, 5).onChange((radius) => {
  scrollbar.update({ trackStyle: { default: { radius } } });
});

track.addColor(trackCfg, '激活状态颜色').onChange((color) => {
  scrollbar.update({ trackStyle: { active: { stroke: color } } });
});

const thumb = cfg.addFolder('滑块');
thumb.open();
const thumbCfg = {
  颜色: '#f5c2cb',
  激活状态颜色: '#f5c2cb',
};
thumb.addColor(thumbCfg, '颜色').onChange((fill) => {
  scrollbar.update({ thumbStyle: { default: { fill } } });
});
thumb.addColor(thumbCfg, '激活状态颜色').onChange((fill) => {
  scrollbar.update({ thumbStyle: { active: { fill } } });
});
