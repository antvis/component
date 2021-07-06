import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Scrollbar } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const scrollbar = new Scrollbar({
  attrs: {
    x: 5,
    y: 50,
    orient: 'horizontal',
    value: 0.5,
    width: 200,
    height: 10,
    isRound: false,
    thumbLen: 30,
  },
});

canvas.appendChild(scrollbar);
