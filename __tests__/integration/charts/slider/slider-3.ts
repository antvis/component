import { Group } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';

export const Slider3 = () => {
  const group = new Group();

  group.appendChild(
    new Slider({
      style: {
        style: {
          x: 10,
          y: 10,
          values: [0.25, 0.75],
          trackLength: 300,
          trackSize: 50,
        },
      },
    })
  );

  return group;
};

Slider3.tags = ['缩略条', '初始值'];
