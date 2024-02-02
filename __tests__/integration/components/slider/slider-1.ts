import { Group } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';

export const Slider1 = () => {
  const group = new Group();

  const slider = group.appendChild(
    new Slider({
      style: {
        x: 10,
        y: 10,
        trackLength: 300,
        trackSize: 50,
      },
    })
  );

  return group;
};

Slider1.tags = ['缩略条', '默认'];
