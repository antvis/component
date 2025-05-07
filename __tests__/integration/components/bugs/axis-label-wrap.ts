import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { mockData } from '../../utils/mock-data';

export const BugAxisLabelWrap = () => {
  const group = new Group({
    style: { width: 1000, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        labelOverlap: [
          {
            type: 'wrap',
            wordWrapWidth: 30,
            maxLines: 2,
            recoverWhenFailed: false,
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
