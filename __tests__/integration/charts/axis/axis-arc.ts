import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisArc = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'arc',
    angleRange: [-90, 270],
    radius: 80,
    lineLineWidth: 1,
    tickLength: (d: any, i: number) => (i % 5 === 0 ? 10 : 5),
    labelSpacing: 10,
    data: data(60),
  });

  createAxis({
    title: '极坐标系',
    center: [150, 150],
    labelFormatter: (d: any, i: number) => (i % 5 === 0 ? i / 5 : ''),
  });

  return group;
};
