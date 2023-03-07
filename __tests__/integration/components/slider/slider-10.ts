import { Group, Circle } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';

export const Slider10 = () => {
  const group = new Group();

  group.appendChild(
    new Slider({
      style: {
        brushable: false,
        handleIconShape: () => new Circle({ style: { r: 5, fill: '#4e76b1' } }),
        padding: 2,
        selectionRadius: 5,
        showHandle: false,
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

Slider10.tags = ['缩略条', '迷你图', '滚动条', '水平'];
