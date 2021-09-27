import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Continuous } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

const createContinuous = (x, y, indicatorCfg = {}) => {
  const continuous = new Continuous({
    style: {
      x,
      y,
      color: '#6d8eea',
      label: false,
      rail: {
        width: 300,
        height: 30,
        ticks: [10, 20, 30, 40, 50, 60, 70, 80, 90],
      },
      handle: false,
      min: 0,
      max: 100,
      indicator: indicatorCfg,
    },
  });
  canvas.appendChild(continuous);
  return continuous;
};

createContinuous(0, 50, false);
createContinuous(0, 150).setIndicator(10);
createContinuous(0, 250, {
  backgroundStyle: { fill: '#748de3', stroke: '#748de3' },
  text: { style: { fill: '#fff' } },
}).setIndicator(20);
createContinuous(0, 350, {
  text: {
    formatter: (val) => {
      return `${val}%`;
    },
  },
}).setIndicator(30);
