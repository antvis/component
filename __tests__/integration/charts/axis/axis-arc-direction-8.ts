import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcDirection8 = () => {
  const group = new Group();

  group.appendChild(
    new Axis({
      style: {
        type: 'arc',
        radius: 80,
        data: data(12),
        lineLineWidth: 5,
        tickLength: 10,
        labelSpacing: 10,
        angleRange: [-90, 270],
        center: [150, 150],
        tickDirection: 'negative',
        labelDirection: 'positive',
        labelAlign: 'perpendicular',
      },
    })
  );

  return group;
};

AxisArcDirection8.tags = ['极坐标系', '刻度朝外', '标签在内', '标签平行于轴线'];
