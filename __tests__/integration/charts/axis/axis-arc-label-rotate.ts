import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisArcLabelParallel = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'arc',
    radius: 80,
    data,
    lineLineWidth: 5,
    tickLength: 10,
    labelSpacing: 15,
  });

  createAxis({ angleRange: [-90, 270], center: [150, 150] });
  createAxis({ angleRange: [-90, 270], center: [400, 150], labelTransform: 'rotate(0)' });
  createAxis({ angleRange: [-90, 270], center: [150, 400], labelTransform: 'rotate(-45)' });
  createAxis({ angleRange: [-90, 270], center: [400, 400], labelTransform: 'rotate(45)' });

  return group;
};
