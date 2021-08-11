import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Continuous } from '@antv/gui';

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

const continuous = new Continuous({
  style: {
    x: 50,
    y: 50,
    title: {
      content: '分块图例',
    },
    padding: 10,
    rail: {
      width: 280,
      height: 30,
      type: 'size',
      chunked: true,
      ticks: [110, 120, 130, 140, 150, 160, 170, 180, 190],
    },
    min: 100,
    max: 200,
    step: 10,
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
