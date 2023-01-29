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
          y,
          ...shape,
          stroke: 'red',
        },
      })
    );
    group.appendChild(
      new Continuous({
        style: {
          x: 0,
          y,
          ...shape,
          ...con,
          type: 'size',
          block: true,
          data: new Array(10).fill(0).map((d, i) => ({ value: i * 100 })),
          showLabel: false,
          handleMarkerSize: 20,
          handleFormatter: (str: any) => `${str}°C`,
          ribbonTrackFill: 'pink',
        },
      })
    );
  });

  return group;
};

Continuous3.tags = ['图例', '连续图例', '尺寸', '分块'];
