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

const horizontalSlider = new Slider({
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

const verticalSlider = new Slider({
  style: {
    x: 50,
    y: 50,
    width: 20,
    height: 400,
    orient: 'vertical',
    values: [0.3, 0.7],
    names: ['2020-08-25', '2020-09-12'],
    handle: {
      size: 13,
    },
  },
});

canvas.appendChild(horizontalSlider);
canvas.appendChild(verticalSlider);
