import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcBasis2 = () => {
  const group = new Group();

  group.appendChild(
    new Axis({
      style: {
        type: 'arc',
        angleRange: [-135, 135],
        center: [150, 150],
        tickDirection: 'negative',
        lineStroke: 'orange',
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

AxisArcBasis2.tags = ['极坐标系', '橙色轴线', '刻度朝外'];
