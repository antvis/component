import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisGrid7 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(6),
        showLabel: false,
        type: 'arc',
        startAngle: 0,
        endAngle: 360,
        center: [200, 150],
        radius: 100,
        lineLineWidth: 1,
        tickLineWidth: 0,
        gridLength: 100,
        gridType: 'segment',
        gridConnect: 'arc',
        gridLineWidth: 0,
        gridAreaFill: 'pink',
        lineArrowOffset: 20,
        tickLength: 10,
        labelSpacing: 10,
      },
    })
  );

  return group;
};

AxisGrid7.tags = ['极坐标系', '条形网格线', '间隔颜色填充', '弧线封闭', '网格线朝内', '扇形'];
