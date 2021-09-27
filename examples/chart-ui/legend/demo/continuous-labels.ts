import { Canvas, Group } from '@antv/g';
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
  height: 700,
  renderer,
});

const group = new Group({});
canvas.appendChild(group);

const createContinuous = (x, y, show, align, title, spacing, style = {}) => {
  group.appendChild(
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
        label: show
          ? {
              align,
              spacing,
              style,
            }
          : false,
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

createContinuous(0, 0, false, 'rail', 'none', 10);
createContinuous(0, 100, true, 'rail', 'rail', 10);
createContinuous(0, 200, true, 'outside', 'outside', 10);
createContinuous(0, 300, true, 'inside', 'inside', 10);
createContinuous(0, 400, true, 'outside', 'font style', 10, { fill: '#91c7ae', fontSize: 12 });
createContinuous(0, 500, true, 'outside', 'spacing', 50);
