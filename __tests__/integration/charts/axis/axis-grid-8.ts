import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisGrid8 = () => {
  const group = new Group({
    style: {
      width: 450,
      height: 500,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        type: 'linear',
        startPos: [200, 50],
        endPos: [200, 250],
        data: data(6),
        tickDirection: 'positive',
        gridDirection: 'negative',
        gridType: 'surround',
        gridConnect: 'arc',
        // @ts-ignore
        gridAreaFill: (datum: any, index: number) => (index % 2 === 0 ? 'pink' : 'transparent'),
        gridCenter: [200, 250],
        gridClosed: false,
        gridLineWidth: 0,
        gridControlAngles: [90, 180, 270],

        tickLength: 10,
        labelSpacing: 10,
      },
    })
  );

  return group;
};

AxisGrid8.tags = ['笛卡尔坐标系', '环绕式网格线', '间隔颜色填充', '弧形连接'];
