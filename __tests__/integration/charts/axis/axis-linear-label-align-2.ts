import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelAlign2 = () => {
  const group = new Group({
    name: '',
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

        startPos: [500, 550],
        endPos: [50, 550],
        tickDirection: 'negative',
      },
    })
  );

  return group;
};
