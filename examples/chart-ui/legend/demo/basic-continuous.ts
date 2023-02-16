import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Continuous } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

const continuous = new Continuous({
  style: {
    padding: [0, 0, 0, 12],
    title: {
      content: '连续图例',
    },
    rail: {
      size: 24,
      length: 120,
    },
    handle: null,
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
window.ConfigPanel([continuous], '样式', {
  'rail.size': { label: '滑轨大小', value: 24, type: 'number', step: 2, range: [12, 32] },
  'rail.length': { label: '滑轨长度', value: 120, type: 'number', step: 10, range: [100, 200] },
  padding: { label: '图例内边距', value: 12, type: 'number', step: 1, range: [10, 20] },
  orientation: {
    label: '图例方向',
    value: 'horizontal',
    options: [
      { name: '横向', value: 'horizontal' },
      { name: '纵向', value: 'vertical' },
    ],
  },
});
