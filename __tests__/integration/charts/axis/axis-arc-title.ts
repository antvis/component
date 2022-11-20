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

  createAxis({ angleRange: [-90, 270], center: [150, 150], titleTransform: 'translate("100%", 0)' });
  createAxis({
    angleRange: [-90, 270],
    center: [400, 150],
    titlePosition: 'b',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [650, 150],
    titlePosition: 'rb',
    titleTransform: 'translate("-100%", 0)',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [900, 150],
    titlePosition: 'inner',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [150, 400],
    titlePosition: 'tl',
    titleTransform: 'translate("100%", 0)',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [400, 400],
    titleSpacing: 10,
    titlePosition: 'l',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [650, 400],
    titleSpacing: 10,
    titlePosition: 'r',
  });
  createAxis({
    angleRange: [-90, 270],
    center: [900, 400],
    titleSpacing: 10,
    titlePosition: 't',
    titleTextBaseline: 'middle',
    labelDirection: 'negative',
  });
  return group;
};
