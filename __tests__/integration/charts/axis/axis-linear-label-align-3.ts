import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelAlign3 = () => {
  const group = new Group({
    style: {
      width: 100,
      height: 550,
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

        startPos: [50, 150],
        endPos: [50, 500],
        tickDirection: 'positive',
        labelDirection: 'negative',
      },
    })
  );

  return group;
};
