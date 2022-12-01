import { Group } from '@antv/g';
import { data } from '../../utils';
import { Axis } from '../../../../src/ui/axis';

export const AxisArcLabelRotate1 = () => {
  const group = new Group();

  group.appendChild(
    new Axis({
      style: {
        type: 'arc',
        radius: 80,
        data: data(10),
        lineLineWidth: 5,
        tickLength: 10,
        labelSpacing: 15,
        angleRange: [-90, 270],
        center: [150, 150],
      },
    })
  );

  return group;
};

AxisArcLabelRotate1.tags = ['极坐标系', '标签在内', '无预设值'];
