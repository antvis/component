import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcDirection5 = () => {
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
          radius: 80,
          startAngle: -90,
          tickDirection: 'negative',
          tickLength: 10,
          type: 'arc',
        },
      },
    })
  );

  return group;
};

AxisArcDirection5.tags = ['极坐标系', '刻度朝外', '标签在外', '标签垂直于轴线'];
