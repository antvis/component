import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelAlign1 = () => {
  const group = new Group({
    style: {
      width: 550,
      height: 150,
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
          startPos: [50, 50],
          endPos: [500, 50],
          tickDirection: 'negative',
        },
      },
    })
  );

  return group;
};
