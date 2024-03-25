import { Group } from '@antv/g';
import { Marker } from '../../../../src';

export const MarkerUpdate = () => {
  const group = new Group();

  const marker = group.appendChild(
    new Marker({
      style: {
        x: 50,
        y: 50,
        symbol: 'circle',
        size: 16,
        stroke: 'blue',
        lineWidth: 2,
      },
    })
  );

  marker.update({ symbol: 'square' });

  return group;
};
