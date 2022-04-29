import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Continuous } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

function createContinuous(chunked = false, y = 0) {
  return new Continuous({
    style: {
      y,
      title: {
        content: '连续图例',
      },
      label: {
        spacing: 6,
      },
      rail: {
        width: 300,
        height: 30,
        ticks: [10, 24, 30, 40, 50, 60, 70, 80, 90],
        chunked,
      },
      handle: {},
      min: 0,
      max: 100,
      color: [
        '#d0e3fa',
        '#acc7f6',
        '#8daaf2',
        '#6d8eea',
        '#4d73cd',
        '#325bb1',
        '#5a3e75',
        '#8c3c79',
        '#e23455',
        '#e7655b',
      ],
    },
  });
}

const continuous = createContinuous(false, 140);
const continuous1 = createContinuous(true, 240);

/** valueChanged */
continuous.addEventListener('valueChanged', (e) => {
  const [stVal, endVal] = e.detail.value;
  start.setValue(stVal);
  end.setValue(endVal);
});
/** onIndicated */
continuous.addEventListener('onIndicated', (e) => {
  indicator.setValue(e.detail.value);
});

canvas.appendChild(continuous);
canvas.appendChild(continuous1);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);

const continuousCfg = {
  起始值: 0,
  结束值: 100,
  指示器: 0,
};
const events = cfg.addFolder('事件');
events.open();
const start = events
  .add(continuousCfg, '起始值', 0, 100)
  .step(1)
  .onChange((value) => {
    const endValue = end.getValue();
    const startValue = value > endValue ? endValue : value;
    continuous.setSelection(startValue, endValue);
  });
const end = events
  .add(continuousCfg, '结束值', 0, 100)
  .step(1)
  .onChange((value) => {
    const startValue = start.getValue();
    const endValue = value < startValue ? startValue : value;
    continuous.setSelection(startValue, endValue);
  });
const indicator = events
  .add(continuousCfg, '指示器', 0, 100)
  .step(1)
  .onChange((value) => {});
