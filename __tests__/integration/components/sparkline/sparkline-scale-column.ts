import { Rect } from '@antv/g';
import { it } from '../../utils';
import { Sparkline } from '../../../../src/ui/sparkline';

export const SparklineScaleColumn = it((group) => {
  const shape1 = { x: 10, y: 10, width: 300, height: 50 };
  group.appendChild(
    new Rect({
      style: {
        ...shape1,
        stroke: 'red',
        lineWidth: 1,
      },
    })
  );

  group.appendChild(
    new Sparkline({
      style: {
        type: 'column',
        ...shape1,
        scale: 0.7,
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    })
  );

  const shape2 = { x: 10, y: 70, width: 300, height: 50 };

  group.appendChild(
    new Rect({
      style: {
        ...shape2,
        stroke: 'red',
        lineWidth: 1,
      },
    })
  );

  group.appendChild(
    new Sparkline({
      style: {
        type: 'column',
        ...shape2,
        isStack: false,
        isGroup: true,
        scale: 0.7,
        data: [
          [-10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    })
  );

  return group;
});
