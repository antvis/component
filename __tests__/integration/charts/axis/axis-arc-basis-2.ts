import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcBasis2 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(12),
        style: {
          center: [150, 150],
          endAngle: 135,
          labelSpacing: 10,
          lineLineWidth: 5,
          lineStroke: 'orange',
          radius: 80,
          startAngle: -135,
          tickDirection: 'negative',
          tickLength: 10,
          type: 'arc',
        },
      },
    })
  );

  return group;
};

AxisArcBasis2.tags = ['极坐标系', '橙色轴线', '刻度朝外'];
