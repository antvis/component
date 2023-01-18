import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelAlign5 = () => {
  const group = new Group({
    style: {
      width: 1000,
      height: 1000,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        type: 'linear',
        data: data(12),
        lineLineWidth: 5,
        tickLineWidth: 5,
        labelSpacing: 5,
        labelFormatter: (_: any, index: number) => 'ABC',
        tickLength: 10,

        startPos: [50, 100],
        endPos: [450, 500],
        tickDirection: 'negative',
      },
    })
  );

  return group;
};
