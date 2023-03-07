import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcDirection4 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(8),
        center: [150, 150],
        endAngle: 270,
        labelAlign: 'perpendicular',
        labelDirection: 'positive',
        labelSpacing: 15,
        lineLineWidth: 5,
        radius: 80,
        startAngle: -90,
        tickDirection: 'negative',
        tickLength: 10,
        type: 'arc',
      },
    })
  );

  return group;
};

AxisArcDirection4.tags = ['极坐标系', '刻度朝外', '标签在内', '标签平行于轴线'];
