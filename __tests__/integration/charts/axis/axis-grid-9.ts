import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisGrid9 = () => {
  const group = new Group({
    style: {
      width: 400,
      height: 400,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        type: 'linear',
        startPos: [200, 50],
        endPos: [200, 200],
        data: data(6),
        tickDirection: 'negative',
        gridType: 'surround',
        gridAreaFill: ['#f2cea5', '#f8dea3', '#c6cf93', '#95b5c0'],
        gridCenter: [200, 200],
        gridLineWidth: 0,
        gridControlAngles: [0, 45, 90, 135, 180, 225, 270, 315],

        tickLength: 10,
        labelSpacing: 10,
      },
    })
  );

  return group;
};

AxisGrid9.tags = ['笛卡尔坐标系', '网格线', '顺序颜色填充', '环绕式', '直线连接'];
