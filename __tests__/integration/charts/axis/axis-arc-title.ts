import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisArcTitle = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'arc',
    radius: 80,
    data: data(8),
    title: 'title',
    lineLineWidth: 5,
    titleFill: 'red',
    titleFontSize: 16,
    titleFontWeight: 'bold',
    tickLength: 10,
    labelSpacing: 15,
  });

  createAxis({ angleRange: [-90, 270], center: [150, 150] });
  createAxis({
    angleRange: [-90, 270],
    center: [400, 150],
    titleAlign: 'middle',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [650, 150],
    titleAlign: 'end',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [900, 150],
    titlePosition: 'inner',
  });
  createAxis({ angleRange: [-90, 270], center: [150, 400], titlePosition: 'top' });
  createAxis({
    angleRange: [-90, 270],
    center: [400, 400],
    titleSpacing: 10,
    titleAlign: 'middle',
    titlePosition: 'left',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [650, 400],
    titleSpacing: 10,
    titleAlign: 'middle',
    titlePosition: 'right',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [900, 400],
    titleSpacing: 10,
    titleAlign: 'middle',
    titlePosition: 'top',
    labelDirection: 'negative',
  });
  return group;
};
