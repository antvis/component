import { Group, Rect } from '@antv/g';
import { deepAssign } from '../../../../src/util';
import { Continuous } from './utils';

export const Continuous2 = () => {
  const group = new Group({
    style: {
      width: 400,
      height: 190,
    },
  });

  const shape = {
    width: 400,
    height: 60,
  };

  const conditions = [{ style: { titleText: 'title' } }, {}, { showHandle: false }];

  conditions.forEach((con, i) => {
    const y = i * (shape.height + 5);
    group.appendChild(
      new Rect({
        style: {
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
            showLabel: false,
            handleFormatter: (str: any) => `${str}°C`,
            data: [{ value: 0 }, { value: 1000 }],
            style: {
              x: 0,
              y,
              ...shape,
              type: 'size',
              handleMarkerSize: 20,
              ribbonTrackFill: 'pink',
            },
          },
          con
        ),
      })
    );
  });

  return group;
};

Continuous2.tags = ['图例', '连续图例', '尺寸'];
