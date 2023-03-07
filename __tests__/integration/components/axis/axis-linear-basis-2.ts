import { Group } from '@antv/g';
import { Text } from '../../../../src/shapes';
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
        data: mockData,
        labelFormatter: ({ label }: any) =>
          new Text({
            style: {
              text: label,
              fill: 'red',
              fontSize: 10,
              textBaseline: 'middle',
            },
          }),
        labelOverlap: [
          {
            type: 'rotate',
            optionalAngles: [0, 30, 45, 60],
          },
          { type: 'hide' },
          { type: 'ellipsis', minLength: 50, maxLength: 60 },
        ],
        startPos: [50, 50],
        endPos: [50, 500],
        labelSpacing: 5,
        labelDirection: 'negative',
        labelAlign: 'horizontal',
        lineStroke: 'green',
        tickLength: 10,
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
