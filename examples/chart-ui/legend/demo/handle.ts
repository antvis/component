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

const createContinuous = (x, y, handleCfg, title, rest = {}) => {
  canvas.appendChild(
    new Continuous({
      style: {
        x,
        y,
        title: {
          content: title,
        },
        color: [
          '#7fc9ac',
          '#87ccae',
          '#90ceb1',
          '#98d1b3',
          '#a0d3b5',
          '#a9d6b8',
          '#b1d8ba',
          '#badbbd',
          '#c2ddbf',
          '#cae0c1',
          '#d3e2c4',
          '#dbe5c6',
        ],
        rail: {
          width: 300,
          height: 30,
          ticks: [10, 20, 30, 40, 50, 60, 70, 80, 90],
        },
        handle: handleCfg,
        min: 0,
        max: 100,
        ...rest,
      },
    })
  );
};

createContinuous(0, 0, false, 'Disabled');
createContinuous(0, 100, {}, 'Enable');
createContinuous(
  0,
  200,
  {
    size: 20,
    icon: {
      marker: 'circle',
      style: {
        fill: '#f0923c',
      },
    },
  },
  'Style',
  { label: null }
);
createContinuous(0, 300, {}, 'Range', { start: 10, end: 80 });
createContinuous(0, 400, {}, 'Cannot Slidable', { slidable: false });
