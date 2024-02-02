import { Group } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';

export const Slider8 = () => {
  const group = new Group();

  group.appendChild(
    new Slider({
      style: {
        showHandle: false,
        sparklineData: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
        x: 10,
        y: 10,
        trackLength: 300,
        trackSize: 50,
        values: [0, 0],
        sparklineType: 'line',
        sparklineSmooth: false,
        sparklineIsStack: true,
      },
    })
  );

  return group;
};

Slider8.tags = ['缩略条', '迷你图', '隐藏手柄'];
