import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcDirection15 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(6),
        style: {
          type: 'arc',
          radius: 80,
          lineLineWidth: 5,
          tickLength: 10,
          labelSpacing: 10,
          startAngle: -90,
          endAngle: 270,
          center: [150, 150],
          tickDirection: 'negative',
          labelDirection: 'positive',
        },
      },
    })
  );

  return group;
};

AxisArcDirection15.tags = ['极坐标系', '刻度朝外', '标签在内', '标签垂直于刻度'];
