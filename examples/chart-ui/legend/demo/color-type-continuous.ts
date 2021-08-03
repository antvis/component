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
      content: '颜色类型',
    },
    label: {
      align: 'outside',
    },
    rail: {
      width: 300,
      height: 30,
    },
    min: 0,
    max: 100,
    start: 10,
    end: 80,
    step: 5,
    color: '#6720f5',
  },
});

canvas.appendChild(continuous);
