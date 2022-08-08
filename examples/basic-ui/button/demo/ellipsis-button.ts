import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Button } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const button = new Button({
  style: {
    x: 50,
    y: 50,
    width: 60,
    text: 'Simple Button',
    ellipsis: true,
  },
});

canvas.appendChild(button);
