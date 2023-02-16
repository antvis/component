import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcBasis4 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(12),
        style: {
          center: [150, 150],
          endAngle: 270,
          labelDirection: 'negative',
          labelSpacing: 10,
          lineLineWidth: 5,
          lineStroke: 'blue',
          radius: 80,
          startAngle: -90,
          tickLength: 10,
          type: 'arc',
        },
      },
    })
  );

  return group;
};

AxisArcBasis4.tags = ['极坐标系', '360度圆形', '标签在外'];
