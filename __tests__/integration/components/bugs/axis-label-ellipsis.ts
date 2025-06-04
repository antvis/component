import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { mockData } from '../../utils/mock-data';

export const BugAxisLabelEllipsis = () => {
  const group = new Group({
    style: { width: 1000, height: 300 },
  });

  const limitedData = mockData.slice(0, 1);

  group.appendChild(
    new Axis({
      style: {
        data: limitedData,
        labelOverlap: [
          {
            type: 'ellipsis',
            suffix: '...',
            maxLength: 50,
            minLength: 20,
            step: 5,
          },
        ],
        startPos: [50, 50],
        endPos: [900, 50],
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

BugAxisLabelEllipsis.tags = ['轴标签', '省略号处理', '单标签支持', 'bug修复'];
