import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisLinearLabelAlignNegative = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'linear',
    data: data(12),
    lineLineWidth: 5,
    tickLineWidth: 5,
    labelSpacing: 5,
    labelFormatter: (_: any, index: number) => 'ABC',
  });

  createAxis({ startPos: [50, 50], endPos: [500, 50], tickDirection: 'negative' });
  createAxis({ startPos: [500, 550], endPos: [50, 550], tickDirection: 'negative' });
  createAxis({ startPos: [50, 150], endPos: [50, 500], tickDirection: 'positive', labelDirection: 'negative' });
  createAxis({ startPos: [100, 500], endPos: [100, 200], tickDirection: 'negative', labelDirection: 'negative' });
  createAxis({ startPos: [50, 100], endPos: [450, 500], tickDirection: 'negative' });
  createAxis({
    startPos: [150, 100],
    endPos: [550, 500],
    tickDirection: 'negative',
    labelDirection: 'positive',
    labelAlign: 'perpendicular',
  });
  createAxis({
    startPos: [250, 100],
    endPos: [650, 500],
    tickDirection: 'negative',
    labelDirection: 'positive',
    labelAlign: 'horizontal',
  });
  createAxis({ startPos: [750, 500], endPos: [350, 100], tickDirection: 'negative' });
  createAxis({
    startPos: [850, 500],
    endPos: [450, 100],
    tickDirection: 'negative',
    labelDirection: 'positive',
    labelAlign: 'perpendicular',
  });
  createAxis({
    startPos: [950, 500],
    endPos: [550, 100],
    tickDirection: 'negative',
    labelDirection: 'positive',
    labelAlign: 'horizontal',
  });

  return group;
};
