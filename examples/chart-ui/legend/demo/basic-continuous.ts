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

const continuous = new Continuous({
  style: {
    title: {
      content: '连续图例',
      spacing: 4,
    },
    rail: {
      width: 100,
      height: 16,
    },
    handle: false,
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

canvas.appendChild(continuous);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const continuousCfg = {
  x: 0,
  y: 0,
  图例宽度: 100,
  图例高度: 16,
};
cfg.add(continuousCfg, 'x', 0, 300).onChange((x) => {
  continuous.attr({ x });
});
cfg.add(continuousCfg, 'y', 0, 300).onChange((y) => {
  continuous.attr({ y });
});
cfg.add(continuousCfg, '图例宽度', 30, 300).onChange((width) => {
  continuous.update({ rail: { width } });
});
cfg.add(continuousCfg, '图例高度', 12, 40).onChange((height) => {
  continuous.update({ rail: { height } });
});
