import { Group, Rect } from '@antv/g';
import { Continuous } from './utils';

export const Continuous3 = () => {
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

  const conditions = [{ titleText: 'title' }, {}, { showHandle: false }];

  conditions.forEach((con, i) => {
    const y = i * (shape.height + 5);
    group.appendChild(
      new Rect({
        style: {
          x: 0,
          y,
          ...shape,
          stroke: 'red',
        },
      })
    );
    group.appendChild(
      new Continuous({
        style: {
          ...shape,
          block: true,
          data: new Array(10).fill(0).map((d: any, i: number) => ({ value: i * 100 })),
          handleFormatter: (str: any) => `${str}°C`,
          handleMarkerSize: 20,
          ribbonTrackFill: 'pink',
          showLabel: false,
          type: 'size',
          x: 0,
          y,
          ...con,
        },
      })
    );
  });

  return group;
};

Continuous3.tags = ['图例', '连续图例', '尺寸', '分块'];
