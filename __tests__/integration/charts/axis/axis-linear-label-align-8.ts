import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelAlign8 = () => {
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

        startPos: [750, 500],
        endPos: [350, 100],
        tickDirection: 'negative',
      },
    })
  );

  return group;
};
