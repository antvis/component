import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelAlign4 = () => {
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

        startPos: [100, 500],
        endPos: [100, 200],
        tickDirection: 'negative',
        labelDirection: 'negative',
      },
    })
  );

  return group;
};
