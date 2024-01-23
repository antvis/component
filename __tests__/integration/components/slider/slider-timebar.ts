import { Slider } from '../../../../src/ui/slider';
import { it } from '../../utils';
import { TimeModeHandle } from '../../../../src/ui/timebar/handle';

export const SliderTimebar = it((group) => {
  group.appendChild(
    new Slider({
      style: {
        handleIconShape: () => new TimeModeHandle({}),
        showLabel: false,
        trackFill: '#edeeef',
        trackLength: 300,
        trackOpacity: 0.5,
        trackRadius: 5,
        trackSize: 5,
        values: [0, 0.75],
        type: 'value',
        transform: 'translate(10, 10)',
      },
    })
  );

  group.appendChild(
    new Slider({
      style: {
        handleIconShape: () => new TimeModeHandle({}),
        showLabel: false,
        trackFill: '#edeeef',
        trackLength: 300,
        trackOpacity: 0.5,
        trackRadius: 5,
        trackSize: 5,
        selectionFill: '#2e7ff8',
        selectionFillOpacity: 1,
        values: [0, 0.5],
        transform: 'translate(10, 30)',
      },
    })
  );

  return group;
});
