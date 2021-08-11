import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Slider } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 600,
  renderer,
});

const slider = new Slider({
  style: {
    x: 50,
    y: 50,
    width: 40,
    height: 400,
    orient: 'vertical',
    values: [0.3, 0.7],
    names: ['aboveVal', 'belowVal'],
  },
});

canvas.appendChild(slider);
