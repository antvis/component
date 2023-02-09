import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcDirection13 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        type: 'arc',
        radius: 80,
        data: data(6),
        lineLineWidth: 5,
        tickLength: 10,
        labelSpacing: 10,
        angleRange: [-90, 270],
        center: [150, 150],
      },
    })
  );

  return group;
};

AxisArcDirection13.tags = ['极坐标系', '刻度朝内', '标签在内', '标签垂直于刻度'];
