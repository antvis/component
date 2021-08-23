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
    text: '无背景',
    padding: [4, 7],
    backgroundStyle: {
      default: null,
    },
  },
});
canvas.appendChild(tag);

const tag2 = new Tag({
  style: {
    x: 100,
    text: '设置背景激活样式',
    padding: [4, 7],
    backgroundStyle: {
      active: {
        fill: 'lightgreen',
        lineWidth: 0,
      },
    },
  },
});
canvas.appendChild(tag2);
