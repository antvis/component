import { Group } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';

export const Slider7 = () => {
  const group = new Group();

  group.appendChild(
    new Slider({
      style: {
        x: 10,
        y: 10,
        trackLength: 300,
        trackSize: 50,
        orientation: 'vertical',
        sparklineType: 'line',
        sparklineSmooth: false,
        sparklineIsStack: true,
        sparklineData: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
        formatter: (value: any) => `${value}°C`,
      },
    })
  );

  return group;
};

Slider7.tags = ['缩略条', '迷你图', '文本'];
