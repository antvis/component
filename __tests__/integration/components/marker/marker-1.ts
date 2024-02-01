import { Group } from '@antv/g';
import { Marker } from '../../../../src';

export const Marker1 = () => {
  const group = new Group();

  const markers = Marker.getSymbols();

  markers.forEach((marker, index) => {
    const x = 20 + (index % 10) * 50;
    const y = 150 + Math.floor(index / 10) * 50;
    group.appendChild(
      new Marker({
        style: {
          x,
          y,
          // transform: `translate(${x}, ${y}) rotate(45deg) translate(${-x}, ${-y})`,
          // transformOrigin: `0 0`,
          transform: 'rotate(45deg)',
          transformOrigin: `${x} ${y}`,
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
