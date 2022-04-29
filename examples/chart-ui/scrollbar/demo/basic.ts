import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Scrollbar } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const horizontalScrollbar = new Scrollbar({
  style: {
    x: 5,
    y: 5,
    orient: 'horizontal',
    value: 0.5,
    width: 200,
    height: 10,
    thumbLen: 30,
  },
});

const verticalScrollbar = new Scrollbar({
  style: {
    x: 5,
    y: 20,
    orient: 'vertical',
    value: 0.5,
    width: 10,
    height: 200,
    thumbLen: 30,
  },
});

canvas.appendChild(horizontalScrollbar);
canvas.appendChild(verticalScrollbar);
