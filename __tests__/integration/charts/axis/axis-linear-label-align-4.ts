import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelAlign4 = () => {
  const group = new Group({
    style: {
      width: 150,
      height: 550,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(12),
        labelFormatter: (_: any, index: number) => 'ABC',
        style: {
          type: 'linear',
          lineLineWidth: 5,
          tickLineWidth: 5,
          labelSpacing: 5,
          tickLength: 10,
          startPos: [100, 500],
          endPos: [100, 200],
          tickDirection: 'negative',
          labelDirection: 'negative',
        },
      },
    })
  );

  return group;
};
