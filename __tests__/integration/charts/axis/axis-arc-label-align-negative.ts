import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisArcLabelAlignNegative = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'arc',
    radius: 80,
    data: data(12),
    lineLineWidth: 5,
    // labelAlign,
    tickLength: 10,
    labelSpacing: 10,
  });

  createAxis({ angleRange: [-90, 270], center: [150, 150], tickDirection: 'negative', labelDirection: 'negative' });
  createAxis({
    angleRange: [-90, 270],
    center: [400, 150],
    tickDirection: 'negative',
    labelDirection: 'negative',
    labelAlign: 'perpendicular',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [150, 400],
    tickDirection: 'negative',
    labelDirection: 'negative',
    labelAlign: 'horizontal',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [400, 400],
    tickDirection: 'negative',
    labelDirection: 'positive',
    labelAlign: 'perpendicular',
  });

  return group;
};
