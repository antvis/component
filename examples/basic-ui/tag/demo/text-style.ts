import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tag } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const tag = new Tag({
  style: {
    x: 100,
    text: '字体激活放大',
    padding: [4, 7],
    textStyle: {
      fontSize: 18,
      fill: 'rgba(0, 0, 0, 0.85)',
    },
  },
});
canvas.appendChild(tag);
tag.addEventListener('mouseenter', () => {
  tag.update({
    textStyle: {
      fontSize: 24,
      fill: 'lightgreen',
    },
  });
});
tag.addEventListener('mouseleave', () => {
  tag.update({
    textStyle: {
      fontSize: 18,
      fill: 'rgba(0, 0, 0, 0.85)',
    },
  });
});
