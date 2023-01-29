import { Group, Rect } from '@antv/g';
import { Continuous } from './utils';

export const Continuous5 = () => {
  const group = new Group({
    style: {
      width: 685,
      height: 805,
    },
  });

  const shape = {
    width: 110,
    height: 400,
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
    const y = Math.floor(i / 6) * (shape.height + 5);
    const x = (i % 6) * (shape.width + 5);

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
          ...shape,
          orient: 'vertical',
          showLabel: true,
          labelSpacing: 10,
          labelAlign: 'value',
          handleMarkerSize: 30,
          handleFormatter: () => '',
          ...con,
        },
      })
    );
  });

  return group;
};

Continuous5.tags = ['图例', '连续图例', '分块', '垂直'];
