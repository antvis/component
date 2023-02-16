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
        style: deepAssign(
          {
            data: new Array(10).fill(0).map((d: any, i: number) => ({ value: i * 100 })),
            showLabel: true,
            handleFormatter: () => '',
            style: {
              x,
              y,
              block: true,
              ...shape,
              orientation: 'vertical',
              labelSpacing: 10,
              labelAlign: 'value',
              handleMarkerSize: 30,
            },
          },
          con
        ),
      })
    );
  });

  return group;
};

Continuous5.tags = ['图例', '连续图例', '分块', '垂直'];
