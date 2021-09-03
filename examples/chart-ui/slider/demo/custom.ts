import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Slider } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

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

const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const sliderFolder = cfg.addFolder('Slider');
sliderFolder.open();
const sliderCfg = {
  起始手柄图标: 'AntV',
  起始手柄大小: 15,
  左间距: 10,
  结束手柄图标: 'diamond',
  结束手柄图标Color: '#fff',
  结束手柄大小: 15,
  右间距: 10,
  手柄文字颜色: '#63656e',
  背景颜色: '#fff',
  背景边框颜色: '#e4eaf5',
  选区颜色: '#afc9fb',
  选区边框颜色: '#afc9fb',
};
sliderFolder.add(sliderCfg, '起始手柄图标', ['AntV', 'yuque', 'default']).onChange((val) => {
  const iconMap = {
    AntV: 'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
    yuque: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
    default: '',
  };
  slider.update({ handle: { start: { handleIcon: iconMap[val] } } });
});
sliderFolder.add(sliderCfg, '结束手柄图标', ['diamond', 'square', 'triangle', 'circle']).onChange((val) => {
  slider.update({ handle: { end: { handleIcon: val } } });
});
sliderFolder.add(sliderCfg, '左间距', 0, 20).onChange((val) => {
  slider.update({ handle: { start: { spacing: val } } });
});
sliderFolder.add(sliderCfg, '起始手柄大小', 0, 20).onChange((val) => {
  slider.update({ handle: { start: { size: val } } });
});
sliderFolder.addColor(sliderCfg, '结束手柄图标Color').onChange((color) => {
  slider.update({ handle: { end: { handleStyle: { fill: color } } } });
});
sliderFolder.add(sliderCfg, '结束手柄大小', 0, 20).onChange((val) => {
  slider.update({
    handle: { end: { size: val } },
  });
});
sliderFolder.add(sliderCfg, '右间距', 0, 20).onChange((val) => {
  slider.update({
    handle: { end: { spacing: val } },
  });
});
sliderFolder.addColor(sliderCfg, '手柄文字颜色').onChange((color) => {
  slider.update({ handle: { textStyle: { fill: color } } });
});
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
