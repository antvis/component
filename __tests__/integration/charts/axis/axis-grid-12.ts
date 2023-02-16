import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisGrid12 = () => {
  const group = new Group({
    style: {
      width: 350,
      height: 400,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(5),
        showLine: false,
        showTick: false,
        showLabel: false,
        style: {
          type: 'linear',
          startPos: [150, 50],
          endPos: [150, 200],
          gridDirection: 'negative',
          gridType: 'surround',
          gridConnect: 'arc',
          gridCenter: [150, 200],
          gridClosed: false,
          gridLineWidth: 1,
          gridStroke: 'rgba(0,0,0,0.5)',
          gridControlAngles: [0, 180, 270],
          tickLength: 10,
          labelSpacing: 10,
        },
      },
    })
  );

  return group;
};

AxisGrid12.tags = ['笛卡尔坐标系', '网格线', '无填充', '圆形', '弧形', '环绕式'];
