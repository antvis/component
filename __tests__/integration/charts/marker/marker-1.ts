import { Group } from '@antv/g';
import { Marker } from '../../../../src';

export const Marker1 = () => {
  const group = new Group();

  group.appendChild(
    new Marker({
      style: {
        style: {
          x: 150,
          y: 150,
          symbol: 'circle',
          size: 10,
          fill: 'red',
        },
      },
    })
  );

  return group;
};
