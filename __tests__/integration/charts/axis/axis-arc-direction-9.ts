import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcDirection9 = () => {
  const group = new Group();

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
        tickDirection: 'positive',
        labelDirection: 'positive',
        labelAlign: 'horizontal',
      },
    })
  );

  return group;
};

AxisArcDirection9.tags = ['极坐标系', '刻度朝内', '标签在内', '标签水平'];
