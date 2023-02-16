import { Group } from '@antv/g';
import { deepAssign } from '../../../../src/util';
import { Handle } from '../../../../src/ui/legend/continuous/handle';

export const HandleDemo = () => {
  const group = new Group({});

  const createHandle = (args: any = {}) => {
    group.appendChild(
      new Handle({
        style: deepAssign(
          {},
          {
            style: {
              x: 100,
              y: 100,
              orientation: 'horizontal',
              labelText: 'labelText',
            },
          },
          args
        ),
      })
    );
  };

  createHandle({ showLabel: false });

  createHandle({ style: { y: 150, orientation: 'vertical' } });

  createHandle({ style: { y: 200, spacing: 10 }, formatter: (str: string) => `formatted text - ${str}` });

  createHandle({ style: { y: 250, markerSize: 40, markerFill: '#c13836', markerStroke: '#fdf1f0', spacing: 10 } });

  return group;
};
