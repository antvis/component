import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisArcLabelAlign = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'arc',
    radius: 80,
    data: data(8),
    lineLineWidth: 5,
    tickLength: 10,
    labelSpacing: 15,
  });

  createAxis({ angleRange: [-90, 270], center: [150, 150] });
  createAxis({
    angleRange: [-90, 270],
    center: [400, 150],
    tickDirection: 'positive',
    labelDirection: 'positive',
    labelAlign: 'perpendicular',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [150, 400],
    tickDirection: 'positive',
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
