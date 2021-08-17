import { Canvas } from '@antv/g';
import { Statistic } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 500,
  height: 100,
  renderer,
});

const statistic = new Statistic({
  style: {
    x: 0,
    y: 0,
    title: {
      text: 'Feedback',
      marker: {
        symbol: 'star',
        x: 8,
        y: 4,
        r: 20,
        fill: 'orange',
      },
    },
    value: {
      text: '1,128',
      spacing: 4,
      textStlye: {
        default: {
          fontSize: 24,
        },
      },
      marker: {
        symbol: 'triangle',
        fill: 'rgb(63, 134, 0)',
        size: 14,
      },
    },
  },
});

canvas.appendChild(statistic);
