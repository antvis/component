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
    names: ['leftVal', 'rightVal'],
    sparkline: {
      color: ['#898989'],
      data: [
        [1, 3, 2, -4, 1, 3, 2, -4],
        [5, 1, 5, -8, 5, 1, 5, -8],
      ],
    },
  },
});

canvas.appendChild(slider);

const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);

const sliderFolder = cfg.addFolder('Slider配置项');
sliderFolder.open();
const sliderCfg = { 左间距: 0, 右间距: 0, 上间距: 0, 下间距: 0 };

const sliderLeft = sliderFolder.add(sliderCfg, '左间距', 0, 10).onChange((value) => {
  slider.update({
    padding: [sliderTop.getValue(), sliderRight.getValue(), sliderBottom.getValue(), value],
  });
});
const sliderRight = sliderFolder.add(sliderCfg, '右间距', 0, 10).onChange((value) => {
  slider.update({
    padding: [sliderTop.getValue(), value, sliderBottom.getValue(), sliderLeft.getValue()],
  });
});
const sliderTop = sliderFolder.add(sliderCfg, '上间距', 0, 10).onChange((value) => {
  slider.update({
    padding: [value, sliderRight.getValue(), sliderBottom.getValue(), sliderLeft.getValue()],
  });
});
const sliderBottom = sliderFolder.add(sliderCfg, '下间距', 0, 10).onChange((value) => {
  slider.update({
    padding: [sliderTop.getValue(), sliderRight.getValue(), value, sliderLeft.getValue()],
  });
});

const sparklineFolder = cfg.addFolder('Sparkline配置项');
sparklineFolder.open();
const sparklineCfg = { 左间距: 0, 右间距: 0, 上间距: 0, 下间距: 0 };

const sparklineLeft = sparklineFolder.add(sparklineCfg, '左间距', 0, 10).onChange((value) => {
  slider.update({
    sparkline: { padding: [sparklineTop.getValue(), sparklineRight.getValue(), sparklineBottom.getValue(), value] },
  });
});
const sparklineRight = sparklineFolder.add(sparklineCfg, '右间距', 0, 10).onChange((value) => {
  slider.update({
    sparkline: { padding: [sparklineTop.getValue(), value, sparklineBottom.getValue(), sparklineLeft.getValue()] },
  });
});
const sparklineTop = sparklineFolder.add(sparklineCfg, '上间距', 0, 10).onChange((value) => {
  slider.update({
    sparkline: { padding: [value, sparklineRight.getValue(), sparklineBottom.getValue(), sparklineLeft.getValue()] },
  });
});
const sparklineBottom = sparklineFolder.add(sparklineCfg, '下间距', 0, 10).onChange((value) => {
  slider.update({
    sparkline: { padding: [sparklineTop.getValue(), sparklineRight.getValue(), value, sparklineLeft.getValue()] },
  });
});
