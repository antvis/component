import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisArcBasis = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'arc',
    angleRange: [-135, 135],
    radius: 80,
    lineLineWidth: 5,
    tickLength: 10,
    labelSpacing: 10,
    data: data(12),
  });

  createAxis({
    center: [150, 150],
    lineArrow: '',
    lineStroke: 'red',
    tickStroke: 'red',
  });

  createAxis({
    center: [400, 150],
    tickDirection: 'negative',
    lineStroke: 'orange',
  });

  createAxis({
    center: [150, 400],
    tickDirection: 'negative',
    labelDirection: 'negative',
    lineStroke: 'green',
  });

  createAxis({
    center: [400, 400],
    angleRange: [-90, 270],
    labelDirection: 'negative',
    lineStroke: 'blue',
  });

  return group;
};
