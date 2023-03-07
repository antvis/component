import { Circle, Group } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';

export const Slider9 = () => {
  const group = new Group();

  group.appendChild(
    new Slider({
      style: {
        handleIconShape: () => new Circle({ style: { r: 5, fill: '#4e76b1' } }),
        showLabel: false,
        trackFill: '#d8e8fb',
        trackLength: 300,
        trackOpacity: 0.5,
        trackRadius: 5,
        trackSize: 10,
        values: [0.25, 0.75],
        x: 10,
        y: 10,
      },
    })
  );

  return group;
};

Slider9.tags = ['缩略条', '迷你图', '自定义手柄'];
