import type { Group } from '@antv/g';
import { Rect } from '@antv/g';
import { axisWarper } from './create-axis';
import { data } from './mock-data';

export const createGrid = (group: Group, len = 400, args = {}) => {
  const g = group.appendChild(
    new Rect({
      style: {
        width: len,
        height: len,
        fill: 'white',
      },
    })
  );

  const createAxis = axisWarper(group, {
    data: data(len / 20),
    labelFormatter: (_: any, i: number) => i * 2,
    showTick: false,
    showGrid: true,
    type: 'linear',
    labelDirection: 'positive',
    gridLength: len,
    showArrow: false,
    lineLineWidth: 0,
    labelSpacing: 10,
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

  return g;
};
