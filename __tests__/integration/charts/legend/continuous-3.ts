import { Group } from '@antv/g';
import { Continuous } from './utils';

export const Continuous3 = () => {
  const group = new Group({});

  group.appendChild(
    new Continuous({
      style: {
        x: 10,
        y: 50,
        type: 'size',
        block: true,
        data: new Array(10).fill(0).map((d, i) => ({ value: i * 100 })),
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

Continuous3.tags = ['图例', '连续图例', '尺寸', '分块'];
