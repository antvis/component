import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisGrid10 = () => {
  const group = new Group({
    style: {
      width: 350,
      height: 400,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        type: 'linear',
        startPos: [150, 50],
        endPos: [150, 200],
        data: data(5),
        showLine: false,
        showTick: false,
        showLabel: false,
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
    })
  );

  return group;
};

AxisGrid10.tags = ['笛卡尔坐标系', '网格线', '无填充', '环绕式', '弧形'];
