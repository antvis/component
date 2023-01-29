import { Group, Rect } from '@antv/g';
import { Continuous } from './utils';

export const Continuous1 = () => {
  const group = new Group({
    style: {
      width: 400,
      height: 250,
    },
  });

  const shape = {
    width: 400,
    height: 80,
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
          data: [{ value: 0 }, { value: 1000 }],
          showLabel: false,
          handleMarkerSize: 30,
          handleFormatter: (str: any) => `${str}°C`,
          ribbonTrackFill: 'pink',
        },
      })
    );
  });

  return group;
};

Continuous1.tags = ['图例', '连续图例'];
