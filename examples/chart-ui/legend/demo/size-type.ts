import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Continuous } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 300,
  renderer,
});

const continuous = new Continuous({
  attrs: {
    title: {
      content: '尺寸类型',
    },
    label: {
      align: 'outside',
    },
    rail: {
      type: 'size',
      width: 300,
      height: 30,
    },
    handle: false,
    min: 0,
    max: 100,
    color: '#f1a545',
  },
});

canvas.appendChild(continuous);
