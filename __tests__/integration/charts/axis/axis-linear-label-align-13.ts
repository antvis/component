import { Group, Text } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelAlign13 = () => {
  const group = new Group({});
  group.appendChild(
    new Axis({
      style: {
        type: 'linear',
        data: data(12),
        lineLineWidth: 5,
        tickLineWidth: 5,
        labelSpacing: 5,
        labelFormatter: (_: any, index: number) => new Text({ style: { text: '666' } }),
        tickLength: 10,

        startPos: [50, 150],
        endPos: [50, 500],
      },
    })
  );

  return group;
};
