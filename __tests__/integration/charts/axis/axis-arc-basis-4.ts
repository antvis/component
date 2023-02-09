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
        type: 'arc',
        center: [150, 150],
        angleRange: [-90, 270],
        labelDirection: 'negative',
        lineStroke: 'blue',
        radius: 80,
        lineLineWidth: 5,
        tickLength: 10,
        labelSpacing: 10,
        data: data(12),
      },
    })
  );

  return group;
};

AxisArcBasis4.tags = ['极坐标系', '360度圆形', '标签在外'];
