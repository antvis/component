import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcBasis3 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(12),
        type: 'arc',
        startAngle: -135,
        endAngle: 135,
        center: [150, 150],
        tickDirection: 'negative',
        labelDirection: 'negative',
        lineStroke: 'green',
        radius: 80,
        lineLineWidth: 5,
        tickLength: 10,
        labelSpacing: 10,
      },
    })
  );

  return group;
};

AxisArcBasis3.tags = ['极坐标系', '刻度朝外', '标签在外'];
