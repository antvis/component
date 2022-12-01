import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcDirection6 = () => {
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
        labelDirection: 'negative',
        labelAlign: 'perpendicular',
      },
    })
  );

  return group;
};

AxisArcDirection6.tags = ['极坐标系', '刻度朝外', '标签在外', '标签平行于轴线'];
