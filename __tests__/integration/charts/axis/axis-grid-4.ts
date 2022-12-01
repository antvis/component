import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisGrid4 = () => {
  const group = new Group();

  group.appendChild(
    new Axis({
      style: {
        type: 'linear',
        startPos: [50, 50],
        endPos: [50, 350],
        data: data(6),
        tickDirection: 'positive',
        gridLength: 200,
        gridDirection: 'negative',
        gridAreaFill: ['#f2cea5', '#f8dea3', '#c6cf93', '#95b5c0'],

        lineLineWidth: 1,
        tickLength: 10,
        labelSpacing: 10,
      },
    })
  );

  return group;
};

AxisGrid4.tags = ['笛卡尔坐标系', '条形网格线', '顺序颜色填充', '纵向'];
