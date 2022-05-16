import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Continuous } from '@antv/gui';

const renderer = new CanvasRenderer();

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
      handle: null,
      min: 0,
      max: 100,
      indicator: indicatorCfg,
    },
  });
  canvas.appendChild(continuous);
  return continuous;
};

createContinuous(0, 50, false);
createContinuous(0, 150, {
  text: {
    formatter: (val) => {
      return `${val}%`;
    },
  },
});
createContinuous(0, 250, {
  id: 'legend-indicator1',
  backgroundStyle: { background: '#748de3' },
  text: { style: { color: 'red' } },
});
createContinuous(0, 350, {
  id: 'legend-indicator2',
  backgroundStyle: { 'font-size': '14px', padding: '2px 4px' },
});
