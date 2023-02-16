import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcBasis1 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      class: 'axis-class',
      style: {
        data: data(12),
        showArrow: false,
        style: {
          center: [150, 150],
          endAngle: 135,
          labelSpacing: 10,
          lineLineWidth: 5,
          lineStroke: 'red',
          radius: 80,
          startAngle: -135,
          tickLength: 10,
          tickStroke: 'red',
          type: 'arc',
        },
      },
    })
  );

  return group;
};

AxisArcBasis1.tags = ['极坐标系', '红色轴线', '隐藏箭头'];
