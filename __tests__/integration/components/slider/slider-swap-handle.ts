import { Group } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';

export const SliderSwapHandle = () => {
  const group = new Group();

  group.appendChild(
    new Slider({
      style: {
        x: 10,
        y: 10,
        trackLength: 300,
        trackSize: 50,
        values: [0.25, 0.75],
        enableHandleSwap: true,
      },
    })
  );

  return group;
};

SliderSwapHandle.tags = ['缩略条', '左右手柄可交换位置'];
