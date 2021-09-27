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
    y: 10,
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

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const sliderCfg = {
  起始值: 0.3,
  结束值: 0.7,
};

const startValue = cfg.add(sliderCfg, '起始值', 0, 1).onChange((value) => {
  const endVal = endValue.getValue();
  const val = value > endVal ? endVal : value;
  slider.update({ values: [val, endVal] });
});
const endValue = cfg.add(sliderCfg, '结束值', 0, 1).onChange((value) => {
  const stVal = startValue.getValue();
  const val = value < stVal ? stVal : value;
  slider.update({ values: [stVal, val] });
});
