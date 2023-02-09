import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisGrid1 = () => {
  const group = new Group({
    style: {
      width: 550,
      height: 300,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        type: 'linear',
        startPos: [50, 50],
        endPos: [500, 50],
        tickDirection: 'negative',
        gridLength: 200,
        gridAreaFill: 'rgba(0,0,0,0.05)',
        gridLineWidth: 0,
        showLabel: false,
        lineLineWidth: 1,
        tickLength: 10,
        labelSpacing: 10,
        data: data(12),
      },
    })
  );

  return group;
};

AxisGrid1.tags = ['笛卡尔坐标系', '条形网格线', '间隔颜色填充'];
