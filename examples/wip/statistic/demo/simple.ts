import { Canvas } from '@antv/g';
import { Statistic } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 100,
  renderer,
});

const statistic = new Statistic({
  style: {
    title: {
      text: 'simple statistic',
    },
    value: {
      text: '5123415515.151',
    },
  },
});

canvas.appendChild(statistic);
