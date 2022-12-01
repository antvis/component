import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArc = () => {
  const group = new Group();

  group.appendChild(
    new Axis({
      style: {
        type: 'arc',
        radius: 80,
        angleRange: [-90, 270],
        center: [150, 150],
        title: '极坐标系',
        titleSpacing: 10,
        data: data(60),
        lineLineWidth: 1,
        tickLength: (d: any, i: number) => (i % 5 === 0 ? 10 : 5),
        labelSpacing: 10,
        labelFormatter: (d: any, i: number) => (i % 5 === 0 ? i / 5 : ''),
      },
    })
  );

  return group;
};

AxisArc.tags = ['极坐标系'];
