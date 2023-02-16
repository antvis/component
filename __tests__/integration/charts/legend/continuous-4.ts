import { Group, Rect } from '@antv/g';
import { deepAssign } from '../../../../src/util';
import { Continuous } from './utils';

export const Continuous4 = () => {
  const group = new Group({
    style: {
      width: 805,
      height: 505,
    },
  });

  const shape = {
    width: 400,
    height: 80,
  };

  const conditions = [
    { style: { labelDirection: 'positive' } },
    { style: { labelDirection: 'negative' } },
    { style: { labelDirection: 'positive', titleText: 'title' } },
    { style: { labelDirection: 'negative', titleText: 'title' } },
    { style: { labelDirection: 'positive' }, showHandle: false },
    { style: { labelDirection: 'negative' }, showHandle: false },
    { style: { labelDirection: 'positive' }, showTick: true },
    { style: { labelDirection: 'negative' }, showTick: true },
    { style: { labelDirection: 'positive', titleText: 'title' }, showTick: true },
    { style: { labelDirection: 'negative', titleText: 'title' }, showTick: true },
    { style: { labelDirection: 'positive' }, showHandle: false, showTick: true },
    { style: { labelDirection: 'negative' }, showHandle: false, showTick: true },
  ];

  conditions.forEach((con, i) => {
    const x = Math.floor(i / 6) * (shape.width + 5);
    const y = (i % 6) * (shape.height + 5);
    group.appendChild(
      new Rect({
        style: {
          x,
          y,
          ...shape,
          stroke: 'red',
        },
      })
    );
    group.appendChild(
      new Continuous({
        style: deepAssign(
          {
            data: new Array(10).fill(0).map((d: any, i: number) => ({ value: i * 100 })),
            handleFormatter: (str: any) => `${str}°C`,
            style: {
              x,
              y,
              block: true,
              labelSpacing: 10,
              labelFontSize: 10,
              labelTickStroke: 'red',
              handleMarkerSize: 20,
              ...shape,
            },
          },
          con
        ),
      })
    );
  });

  return group;
};

Continuous4.tags = ['图例', '连续图例', '分块'];
