import { Canvas } from '@antv/g';
import { Countdown } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 400,
  height: 300,
  renderer,
});

const countdown = new Countdown({
  attrs: {
    x: 0,
    y: 0,
    title: {
      text: 'now countdown',
    },
    value: {
      format: 'YYYY-MM-DD HH:mm:ss',
      dynamicTime: true,
    },
  },
});

canvas.appendChild(countdown);
