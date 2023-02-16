import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcTitle8 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(8),
        style: {
          type: 'arc',
          radius: 80,
          titleText: 'title',
          lineLineWidth: 5,
          titleFill: 'red',
          titleFontSize: 16,
          titleFontWeight: 'bold',
          titleSpacing: 10,
          tickLength: 10,
          labelSpacing: 15,
          startAngle: -90,
          endAngle: 270,
          center: [150, 150],
          titlePosition: 't',
          titleTextBaseline: 'middle',
          labelDirection: 'negative',
        },
      },
    })
  );

  return group;
};

AxisArcTitle8.tags = ['极坐标系', '标题', '正上', '居上', '居中', '标题在外'];
