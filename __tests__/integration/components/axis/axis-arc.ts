import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArc = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(60),
        labelFormatter: (d: any, i: number) => (i % 5 === 0 ? i / 5 : ''),
        type: 'arc',
        radius: 80,
        startAngle: -90,
        endAngle: 270,
        center: [150, 150],
        titleText: '极坐标系',
        titleSpacing: 10,
        lineLineWidth: 1,
        tickLength: (d: any, i: number) => (i % 5 === 0 ? 10 : 5),
        labelSpacing: 10,
      },
    })
  );

  return group;
};

AxisArc.tags = ['极坐标系'];
