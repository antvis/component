import { Group } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';

export const AxisLinearBasis4 = () => {
  const group = new Group();

  group.appendChild(
    new Axis({
      style: {
        startPos: [550, 500],
        endPos: [100, 50],
        data: mockData,
        lineLineWidth: 5,
        lineStroke: 'blue',
        tickStroke: 'blue',
        tickLength: 10,
        labelSpacing: 5,
        labelTransform: 'rotate(-45)',

        type: 'linear',
        tickLineWidth: 5,
      },
    })
  );

  return group;
};

AxisLinearBasis4.tags = ['笛卡尔坐标系', '倾斜', '反向'];
