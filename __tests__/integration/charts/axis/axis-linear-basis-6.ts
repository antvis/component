import { Group } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';

export const AxisLinearBasis6 = () => {
  const group = new Group({
    style: {
      width: 200,
      height: 550,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        style: {
          startPos: [50, 500],
          endPos: [50, 50],
          lineLineWidth: 5,
          lineStroke: 'purple',
          tickLength: 10,
          labelSpacing: 5,
          labelAlign: 'horizontal',
          type: 'linear',
          tickLineWidth: 5,
        },
      },
    })
  );

  return group;
};

AxisLinearBasis6.tags = ['笛卡尔坐标系', '垂直', '反向'];
