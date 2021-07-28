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
  attrs: {
    title: {
      content: '连续图例',
    },
    label: {
      align: 'outside',
    },
    rail: {
      width: 300,
      height: 30,
      ticks: [20, 40, 60, 80],
    },
    handle: false,
    min: 0,
    max: 100,
    color: '#ef923c',
  },
});

canvas.appendChild(continuous);
