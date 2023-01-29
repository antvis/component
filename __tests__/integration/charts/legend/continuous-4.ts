import { Group, Rect } from '@antv/g';
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
    { labelDirection: 'positive' },
    { labelDirection: 'negative' },
    { labelDirection: 'positive', titleText: 'title' },
    { labelDirection: 'negative', titleText: 'title' },
    { labelDirection: 'positive', showHandle: false },
    { labelDirection: 'negative', showHandle: false },
    { labelDirection: 'positive', labelShowTick: true },
    { labelDirection: 'negative', labelShowTick: true },
    { labelDirection: 'positive', titleText: 'title', labelShowTick: true },
    { labelDirection: 'negative', titleText: 'title', labelShowTick: true },
    { labelDirection: 'positive', showHandle: false, labelShowTick: true },
    { labelDirection: 'negative', showHandle: false, labelShowTick: true },
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
        style: {
          x,
          y,
          block: true,
          data: new Array(10).fill(0).map((d, i) => ({ value: i * 100 })),
          labelSpacing: 10,
          labelFontSize: 10,
          labelTickLength: 30,
          labelTickStroke: 'red',
          handleMarkerSize: 20,
          handleFormatter: (str: any) => `${str}°C`,
          ...shape,
          ...con,
        },
      })
    );
  });

  return group;
};

Continuous4.tags = ['图例', '连续图例', '分块'];
