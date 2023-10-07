import { Group, Circle } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';

export const AxisLinearLabelOverlapCrossSizeVertical = () => {
  const group = new Group({
    style: {
      width: 280,
      height: 550,
    },
  });

  group.appendChild(
    new Circle({
      style: {
        r: 5,
        fill: 'red',
      },
    })
  );

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
        crossSize: 100,
        startPos: [100, 500],
        endPos: [100, 50],
        lineLineWidth: 2,
        lineStroke: 'black',
        tickLineWidth: 2,
        tickStroke: 'black',
        labelSpacing: 10,
        labelAlign: 'horizontal',
        labelDirection: 'negative',
        type: 'linear',
      },
    })
  );

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
        crossSize: 100,
        startPos: [250, 50],
        endPos: [250, 500],
        lineLineWidth: 2,
        lineStroke: 'black',
        tickLineWidth: 2,
        tickStroke: 'black',
        labelSpacing: 10,
        labelAlign: 'horizontal',
        type: 'linear',
      },
    })
  );

  return group;
};

AxisLinearLabelOverlapCrossSizeVertical.tags = ['笛卡尔坐标系', '截断', '水平', '正向', '缩略'];
