import { Group } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';

export const Slider4 = () => {
  const group = new Group();

  const slider = group.appendChild(
    new Slider({
      style: {
        style: {
          x: 10,
          y: 10,
          trackLength: 300,
          trackSize: 50,
        },
      },
    })
  );

  slider.addEventListener('valuechange', (e: any) => {
    console.log('value change', e);
  });

  return group;
};

Slider4.tags = ['缩略条', '事件'];
