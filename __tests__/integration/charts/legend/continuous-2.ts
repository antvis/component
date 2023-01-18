import { Group } from '@antv/g';
import { Continuous } from './utils';

export const Continuous2 = () => {
  const group = new Group({
    style: {
      width: 500,
      height: 150,
    },
  });

  group.appendChild(
    new Continuous({
      style: {
        x: 10,
        y: 50,
        type: 'size',
        data: [{ value: 0 }, { value: 250 }, { value: 500 }, { value: 750 }, { value: 1000 }],
        ribbonLen: 400,
        ribbonSize: 30,
        showLabel: false,
        handleMarkerSize: 30,
        handleFormatter: (str: any) => `${str}°C`,
        ribbonTrackFill: 'pink',
      },
    })
  );

  return group;
};

Continuous2.tags = ['图例', '连续图例', '尺寸'];
