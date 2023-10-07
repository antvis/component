import { Group, Rect } from '@antv/g';
import { Continuous } from './utils';
import { deepAssign } from '../../../../src/util';

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
    { labelDirection: 'positive', showTick: true },
    { labelDirection: 'negative', showTick: true },
    { labelDirection: 'positive', titleText: 'title', showTick: true },
    { labelDirection: 'negative', titleText: 'title', showTick: true },
    { labelDirection: 'positive', showHandle: false, showTick: true },
    { labelDirection: 'negative', showHandle: false, showTick: true },
  ] as const;

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
          block: true,
          data: new Array(10).fill(0).map((d: any, i: number) => ({ value: i * 100 })),
          handleFormatter: () => '',
          handleMarkerSize: 30,
          labelAlign: 'value',
          labelSpacing: 10,
          orientation: 'vertical',
          showLabel: true,
          x,
          y,
          ...shape,
          ...con,
        },
      })
    );
  });

  return group;
};

Continuous5.tags = ['图例', '连续图例', '分块', '垂直'];
