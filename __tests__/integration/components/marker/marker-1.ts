import { Group } from '@antv/g';
import { Marker } from '../../../../src';

export const Marker1 = () => {
  const group = new Group();

  const markers = Marker.getSymbols();

  markers.forEach((marker, index) => {
    group.appendChild(
      new Marker({
        style: {
          x: 20 + (index % 10) * 50,
          y: 150 + Math.floor(index / 10) * 50,
          transform: `rotate(30deg)`,
          transformOrigin: 'center',
          symbol: marker,
          size: 16,
          stroke: 'blue',
          lineWidth: 2,
        },
      })
    );
  });

  return group;
};
