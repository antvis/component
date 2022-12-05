import { Group } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';

export const Slider4 = () => {
  const group = new Group();

  const slider = group.appendChild(
    new Slider({
      style: {
        x: 10,
        y: 10,
        length: 300,
        size: 50,
        onValueChange: console.log,
      },
    })
  );

  slider.addEventListener('valueChange', (e: any) => {
    console.log('value change', e);
  });

  return group;
};

Slider4.tags = ['缩略条', '事件'];
