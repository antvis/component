import { Group, Text } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';

export const AxisLinearBasis2 = () => {
  const group = new Group({
    style: {
      width: 200,
      height: 550,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        startPos: [50, 50],
        endPos: [50, 500],
        data: mockData,
        labelSpacing: 5,
        labelDirection: 'negative',
        labelTransform: 'rotate(0)',
        lineStroke: 'green',
        tickLength: 10,
        labelFormatter: ({ label }: any) =>
          new Text({
            style: {
              text: label,
              fill: 'red',
              fontSize: 10,
              textBaseline: 'middle',
            },
          }),

        type: 'linear',
        lineLineWidth: 5,
        tickLineWidth: 5,
        tickStroke: 'green',
      },
    })
  );

  return group;
};

AxisLinearBasis2.tags = ['笛卡尔坐标系', '垂直', '正向'];
