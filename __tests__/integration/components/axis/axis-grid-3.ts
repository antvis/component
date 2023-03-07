import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisGrid3 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        showLabel: false,
        showTick: false,
        data: data(12),
        type: 'arc',
        startAngle: 0,
        endAngle: 360,
        center: [200, 150],
        radius: 100,
        lineLineWidth: 1,
        gridLength: 100,
        gridType: 'segment',
        gridConnect: 'arc',
        gridLineWidth: 1,
        gridStroke: 'rgba(0,0,0,0.5)',
        tickLength: 10,
        labelSpacing: 10,
      },
    })
  );

  return group;
};

AxisGrid3.tags = ['极坐标系', '条形网格线', '无填充', '直线封闭', '网格线朝内', '扇形'];
