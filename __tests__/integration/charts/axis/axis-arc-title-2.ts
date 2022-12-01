import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcTitle2 = () => {
  const group = new Group();

  group.appendChild(
    new Axis({
      style: {
        type: 'arc',
        radius: 80,
        data: data(8),
        title: 'title',
        lineLineWidth: 5,
        titleFill: 'red',
        titleFontSize: 16,
        titleFontWeight: 'bold',
        titleSpacing: 10,
        tickLength: 10,
        labelSpacing: 15,
        angleRange: [-90, 270],
        center: [150, 150],
        titlePosition: 'b',
      },
    })
  );

  return group;
};

AxisArcTitle2.tags = ['极坐标系', '标题', '正下', '居中'];
