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
    { labelDirection: 'positive', block: true },
    { labelDirection: 'negative', block: true },
    { labelDirection: 'positive', block: true, titleText: 'title' },
    { labelDirection: 'negative', block: true, titleText: 'title' },
    { labelDirection: 'positive', block: true, showHandle: false },
    { labelDirection: 'negative', block: true, showHandle: false },
    { labelDirection: 'positive', block: true, showTick: true },
    { labelDirection: 'negative', block: true, showTick: true },
    { labelDirection: 'positive', block: true, titleText: 'title', showTick: true },
    { labelDirection: 'negative', block: true, titleText: 'title', showTick: true },
    { labelDirection: 'positive', block: true, showHandle: false, showTick: true },
    { labelDirection: 'negative', block: true, showHandle: false, showTick: true },
    { labelDirection: 'positive', block: true },
    { labelDirection: 'negative', block: false },
  ] as const;

  const half = conditions.length / 2;

  conditions.forEach((con, i) => {
    const y = Math.floor(i / half) * (shape.height + 5);
    const x = (i % half) * (shape.width + 5);

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
          data: new Array(10).fill(0).map((d: any, i: number) => ({ value: i * 100 })),
          handleFormatter: () => '',
          handleMarkerSize: 30,
          labelAlign: 'value',
          labelSpacing: 10,
          orientation: 'vertical',
          showLabel: true,
          transform: `translate(${x}, ${y})`,
          ...shape,
          ...con,
        },
      })
    );
  });

  return group;
};

Continuous5.tags = ['图例', '连续图例', '分块', '垂直'];
