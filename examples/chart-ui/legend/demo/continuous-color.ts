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

const createContinuous = (x, y, color) => {
  canvas.appendChild(
    new Continuous({
      style: {
        x,
        y,
        color,
        label: false,
        rail: {
          width: 300,
          height: 30,
          ticks: [10, 20, 30, 40, 50, 60, 70, 80, 90],
        },
        handle: false,
        min: 0,
        max: 100,
      },
    })
  );
};

createContinuous(0, 0, '#6d8eea');

createContinuous(0, 50, [
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
]);

createContinuous(0, 100, [
  '#fff7f0',
  '#feefe2',
  '#fde8d5',
  '#fce0c7',
  '#fbd8b9',
  '#fad1ab',
  '#f9c99e',
  '#f8c290',
  '#f7ba82',
  '#f6b274',
  '#f5ab67',
  '#f4a359',
]);
