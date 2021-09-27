import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { CircleCrosshair } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

const circle = new CircleCrosshair({
  style: {
    center: [250, 250],
    defaultRadius: 50,
    lineStyle: {
      lineWidth: 2,
    },
  },
});
canvas.appendChild(circle);

canvas.addEventListener('mousemove', (e) => {
  circle.setPointer([e.offsetX, e.offsetY]);
});
