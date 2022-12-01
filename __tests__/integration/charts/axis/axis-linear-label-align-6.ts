import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelAlign6 = () => {
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

        startPos: [150, 100],
        endPos: [550, 500],
        tickDirection: 'negative',
        labelDirection: 'positive',
        labelAlign: 'perpendicular',
      },
    })
  );

  return group;
};
