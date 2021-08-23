import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tag } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const tag = new Tag({
  style: {
    text: '字体激活',
    padding: [4, 7],
    textStyle: {
      default: {
        fontSize: 18,
        fill: 'rgba(0, 0, 0, 0.85)',
      },
      active: {
        fill: 'lightgreen',
      },
    },
  },
});
canvas.appendChild(tag);

const tag2 = new Tag({
  style: {
    x: 100,
    text: '字体激活放大',
    padding: [4, 7],
    textStyle: {
      default: {
        fontSize: 18,
        fill: 'rgba(0, 0, 0, 0.85)',
      },
      active: {
        fontSize: 24,
        fill: 'lightgreen',
      },
    },
  },
});
canvas.appendChild(tag2);
