import { Group } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';

export const AxisLinearBasis1 = () => {
  const group = new Group({
    style: {
      width: 650,
      height: 80,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        showTrunc: true,
        labelFormatter: () => '123',
        style: {
          startPos: [50, 50],
          endPos: [600, 50],
          lineStroke: 'red',
          truncRange: [0.4, 0.6],
          lineExtension: [10, 10],
          tickLength: 10,
          type: 'linear',
          lineLineWidth: 5,
          tickLineWidth: 5,
          tickStroke: 'green',
          labelSpacing: 10,
        },
      },
    })
  );

  return group;
};

AxisLinearBasis1.tags = ['笛卡尔坐标系', '截断', '水平', '正向'];
