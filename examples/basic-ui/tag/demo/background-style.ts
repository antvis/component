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

const tag0 = new Tag({
  style: {
    text: '无背景',
    padding: [4, 7],
    backgroundStyle: null,
  },
});
canvas.appendChild(tag0);

const tag = new Tag({
  style: {
    x: 100,
    text: '设置背景激活样式',
    padding: [4, 7],
    textStyle: {
      cursor: 'pointer',
    },
    backgroundStyle: {},
  },
});
canvas.appendChild(tag);
tag.addEventListener('mouseenter', () => {
  tag.update({
    backgroundStyle: {
      fill: 'lightgreen',
      lineWidth: 0,
      cursor: 'pointer',
    },
  });
});
tag.addEventListener('mouseleave', () => {
  tag.update({
    backgroundStyle: {
      lineWidth: 1,
      fill: '#fafafa',
    },
  });
});
