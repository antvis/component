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
  height: 500,
  renderer,
});

const slider = new Slider({
  style: {
    x: 50,
    y: 50,
    width: 400,
    height: 20,
    values: [0.3, 0.7],
    names: ['2020-08-25', '2020-09-12'],
    handle: {
      size: 13,
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
  方向: 'horizontal',
  宽度: 400,
  高度: 20,
  起始值: 0.3,
  结束值: 0.7,
  起始文本: '2020-08-25',
  结束文本: '2020-09-12',
  手柄大小: 13,
};

sliderFolder.add(sliderCfg, '方向', ['horizontal', 'vertical']).onChange((orient) => {
  const w = width.getValue();
  const h = height.getValue();
  width.setValue(h);
  height.setValue(w);
  slider.update({ orient });
});
const width = sliderFolder.add(sliderCfg, '宽度', 10, 400).onChange((width) => {
  slider.update({ width });
});
const height = sliderFolder.add(sliderCfg, '高度', 10, 400).onChange((height) => {
  slider.update({ height });
});
const startValue = sliderFolder.add(sliderCfg, '起始值', 0, 1).onChange((value) => {
  const endVal = endValue.getValue();
  const val = value > endVal ? endVal : value;
  slider.update({ values: [val, endVal] });
});
const endValue = sliderFolder.add(sliderCfg, '结束值', 0, 1).onChange((value) => {
  const stVal = startValue.getValue();
  const val = value < stVal ? stVal : value;
  slider.update({ values: [stVal, val] });
});
const startName = sliderFolder.add(sliderCfg, '起始文本').onChange((name) => {
  slider.update({ names: [name, endName.getValue()] });
});
const endName = sliderFolder.add(sliderCfg, '结束文本').onChange((name) => {
  slider.update({ names: [startName.getValue(), name] });
});
sliderFolder.add(sliderCfg, '手柄大小', 5, 20).onChange((size) => {
  slider.update({ handle: { size } });
});

slider.addEventListener(
  'valueChanged',
  ({
    detail: {
      value: [stVal, endVal],
    },
  }) => {
    startValue.setValue(stVal);
    endValue.setValue(endVal);
  }
);
