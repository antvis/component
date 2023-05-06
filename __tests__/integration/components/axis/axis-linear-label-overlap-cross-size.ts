import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { mockData } from '../../utils/mock-data';

export const AxisLinearLabelOverlapCrossSize = () => {
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
        labelOverlap: [
          {
            type: 'ellipsis',
            minLength: 30,
            maxLength: 100,
            suffix: '...',
          },
        ],
        crossSize: 80,
        startPos: [50, 50],
        endPos: [500, 50],
        lineLineWidth: 2,
        lineStroke: 'black',
        tickLineWidth: 2,
        tickStroke: 'black',
        labelSpacing: 10,
        type: 'linear',
        labelTransform: 'rotate(90)',
      },
    })
  );

  return group;
};

AxisLinearLabelOverlapCrossSize.tags = ['笛卡尔坐标系', '截断', '水平', '正向', '缩略'];
