import { Group } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';

export const Slider2 = () => {
  const group = new Group();

  group.appendChild(
    new Slider({
      style: {
        x: 10,
        y: 10,
        trackLength: 300,
        trackSize: 50,
        orient: 'vertical',
      },
    })
  );

  return group;
};

Slider2.tags = ['缩略条', '垂直'];
