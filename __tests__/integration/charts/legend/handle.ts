import { Handle } from '@/ui/legend/continuous/handle';
import { Marker } from '@/ui/marker';
import { Group } from '@antv/g';

export const HandleDemo = () => {
  const group = new Group({});

  const createHandle = (args: any = {}) => {
    group.appendChild(
      new Handle({
        style: {
          x: 100,
          y: 100,
          orient: 'horizontal',
          labelText: 'labelText',
          ...args,
        },
      })
    );
  };

  createHandle({ showLabel: false });

  createHandle({ y: 150, orient: 'vertical' });

  createHandle({ y: 200, spacing: 10, formatter: (str: string) => `formatted text - ${str}` });

  createHandle({ y: 250, markerSize: 40, markerFill: '#c13836', markerStroke: '#fdf1f0', spacing: 10 });

  return group;
};
