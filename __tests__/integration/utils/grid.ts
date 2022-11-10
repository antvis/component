import type { Group } from '@antv/g';
import { Rect } from '@antv/g';
import { axisWarper } from './create-axis';
import { data } from './mock-data';

export const createGrid = (group: Group, len = 400, args = {}) => {
  group.appendChild(
    new Rect({
      style: {
        width: len,
        height: len,
        fill: 'white',
      },
    })
  );

  const createAxis = axisWarper(group, {
    type: 'linear',
    data: data(len / 20),
    labelDirection: 'positive',
    labelFormatter: (_: any, i: number) => i * 2,
    gridLength: len,
    lineLineWidth: 0,
    labelSpacing: 10,
    showTick: false,
    showGrid: true,
    gridStroke: 'lightgray',
    gridDirection: 'negative',
    ...args,
  });

  createAxis({
    startPos: [0, 0],
    endPos: [0, len],
  });

  createAxis({
    startPos: [0, 0],
    endPos: [len, 0],
    labelDirection: 'negative',
    gridDirection: 'positive',
  });
};
