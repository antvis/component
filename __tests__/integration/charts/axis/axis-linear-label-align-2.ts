import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelAlign2 = () => {
  const group = new Group({
    style: {
      width: 550,
      height: 600,
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
          startPos: [500, 550],
          endPos: [50, 550],
          tickDirection: 'negative',
        },
      },
    })
  );

  return group;
};
