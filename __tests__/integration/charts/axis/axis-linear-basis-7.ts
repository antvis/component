import { Group } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';

export const AxisLinearBasis7 = () => {
  const group = new Group({
    style: {
      width: 550,
      height: 200,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        labelTransform: [
          {
            type: 'ellipsis',
            minLength: 50,
            maxLength: 100,
            suffix: '...',
          },
        ],
        showTrunc: true,
        style: {
          startPos: [50, 50],
          endPos: [500, 50],
          truncRange: [0.1, 0.3],
          lineLineWidth: 2,
          lineStroke: 'black',
          tickLineWidth: 2,
          tickStroke: 'black',
          labelTransform: 'rotate(90)',
          type: 'linear',
        },
      },
    })
  );

  return group;
};

AxisLinearBasis7.tags = ['笛卡尔坐标系', '截断', '水平', '正向', '缩略'];
