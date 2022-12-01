import { Group } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';

export const AxisLinearBasis7 = () => {
  const group = new Group();

  group.appendChild(
    new Axis({
      style: {
        startPos: [50, 50],
        endPos: [500, 50],
        data: mockData,
        truncRange: [0.1, 0.3],
        lineLineWidth: 2,
        lineStroke: 'black',
        tickLineWidth: 2,
        tickStroke: 'black',
        labelTransform: 'rotate(90)',
        labelTransforms: [
          {
            type: 'ellipsis',
            minLength: 50,
            maxLength: 100,
            suffix: '...',
          },
        ],

        type: 'linear',
      },
    })
  );

  return group;
};

AxisLinearBasis7.tags = ['笛卡尔坐标系', '截断', '水平', '正向', '缩略'];
