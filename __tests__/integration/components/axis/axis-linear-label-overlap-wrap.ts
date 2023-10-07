import { Group } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';

export const AxisLinearLabelOverlapWrap = () => {
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
            type: 'wrap',
            wordWrapWidth: 30,
            maxLines: 5,
            recoverWhenFailed: false,
          },
          {
            type: 'hide',
          },
        ],
        startPos: [50, 50],
        endPos: [500, 50],
        lineLineWidth: 2,
        lineStroke: 'black',
        tickLineWidth: 2,
        tickStroke: 'black',
        labelSpacing: 10,
        type: 'linear',
      },
    })
  );

  return group;
};

AxisLinearLabelOverlapWrap.tags = ['笛卡尔坐标系', '截断', '水平', '正向', '缩略'];
