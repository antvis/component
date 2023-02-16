import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcDirection1 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(8),
        style: {
          center: [150, 150],
          endAngle: 270,
          labelSpacing: 15,
          lineLineWidth: 5,
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

AxisArcDirection1.tags = ['极坐标系', '刻度朝内', '标签在内', '标签垂直于轴线'];
