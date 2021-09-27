import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { LineCrosshair } from '@antv/gui';

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

const line = new LineCrosshair({
  style: {
    startPos: [100, 50],
    endPos: [100, 400],
    lineStyle: {
      lineWidth: 2,
    },
    text: {
      text: '123',
      position: 'start',
    },
  },
});

canvas.appendChild(line);

canvas.addEventListener('mousemove', (e) => {
  line.setPointer([e.offsetX, e.offsetY]);
});
