import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tag } from '@antv/gui';

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

const tag1 = new Tag({
  attrs: {
    x: 0,
    y: 10,
    text: 'Tag 1',
    padding: [4, 7],
    textStyle: {
      default: {
        fontSize: 12,
        fill: 'rgba(0, 0, 0, 0.85)',
      },
    },
  },
});
canvas.appendChild(tag1);

const linkTag = new Tag({
  attrs: {
    x: 0,
    y: 40,
    text: 'Link Tag',
    padding: [4, 7],
    textStyle: {
      default: {
        fontSize: 12,
        fill: 'rgba(0, 0, 0, 0.85)',
      },
      active: {
        cursor: 'pointer',
      },
    },
  },
});
canvas.appendChild(linkTag);
// 监听事件
linkTag.on('click', () => {
  window.open('httsp://github.com/antvis/gui');
});
