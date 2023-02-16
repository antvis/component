import { Group } from '@antv/g';
import { Sparkline } from '../../../../src/ui/sparkline';

export const Sparkline1 = () => {
  const group = new Group();

  group.appendChild(
    new Sparkline({
      style: {
        style: {
          x: 10,
          y: 10,
          type: 'line',
          width: 300,
          height: 50,
          smooth: false,
        },
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [-10, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    })
  );

  return group;
};

Sparkline1.tags = ['迷你图', '折线图'];
