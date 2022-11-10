import { Group, Text } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisLinearLabelAlign = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'linear',
    data: data(12),
    lineLineWidth: 5,
    tickLineWidth: 5,
    labelSpacing: 5,
    labelFormatter: (_: any, index: number) => new Text({ style: { text: '666' } }),
  });

  createAxis({ startPos: [50, 50], endPos: [500, 50] });
  createAxis({ startPos: [500, 550], endPos: [50, 550] });
  createAxis({ startPos: [50, 150], endPos: [50, 500] });
  createAxis({ startPos: [100, 500], endPos: [100, 200] });
  createAxis({ startPos: [50, 100], endPos: [450, 500] });
  createAxis({ startPos: [150, 100], endPos: [550, 500], labelAlign: 'perpendicular' });
  createAxis({ startPos: [250, 100], endPos: [650, 500], labelAlign: 'horizontal' });
  createAxis({ startPos: [750, 500], endPos: [350, 100] });
  createAxis({ startPos: [850, 500], endPos: [450, 100], labelAlign: 'perpendicular' });
  createAxis({ startPos: [950, 500], endPos: [550, 100], labelAlign: 'horizontal' });

  return group;
};
