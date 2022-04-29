import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Slider } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 300,
  renderer,
});

const slider = new Slider({
  style: {
    x: 50,
    y: 50,
    width: 400,
    height: 40,
    values: [0.3, 0.7],
    names: ['startVal', 'endVal'],
    handle: {
      start: {
        formatter: (name, value) => {
          return `${name}: ${(value * 100).toFixed(2)}%`;
        },
        handleIcon: 'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
      },
      end: {
        handleIcon: 'diamond',
      },
    },
  },
});

canvas.appendChild(slider);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const sliderFolder = cfg.addFolder('Slider');
sliderFolder.open();
const sliderCfg = {
  背景颜色: '#fff',
  背景边框颜色: '#e4eaf5',
  选区颜色: '#afc9fb',
  选区边框颜色: '#afc9fb',
};

sliderFolder.addColor(sliderCfg, '背景颜色').onChange((color) => {
  slider.update({ backgroundStyle: { default: { fill: color } } });
});
sliderFolder.addColor(sliderCfg, '背景边框颜色').onChange((color) => {
  slider.update({ backgroundStyle: { default: { stroke: color } } });
});
sliderFolder.addColor(sliderCfg, '选区颜色').onChange((color) => {
  slider.update({ selectionStyle: { default: { fill: color } } });
});
sliderFolder.addColor(sliderCfg, '选区边框颜色').onChange((color) => {
  slider.update({ selectionStyle: { default: { stroke: color } } });
});
