import { Group } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';

export const AxisLinearBasis5 = () => {
  const group = new Group({
    style: {
      width: 550,
      height: 150,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        showTrunc: true,
        style: {
          startPos: [50, 50],
          endPos: [500, 50],
          tickDirection: 'negative',
          lineLineWidth: 5,
          lineStroke: 'pink',
          truncRange: [0.4, 0.6],
          lineExtension: [10, 10],
          tickLength: 10,
          labelSpacing: 5,
          labelTransform: 'rotate(90)',
          type: 'linear',
          tickLineWidth: 5,
        },
      },
    })
  );

  return group;
};

AxisLinearBasis5.tags = ['笛卡尔坐标系', '截断', '水平', '正向'];
