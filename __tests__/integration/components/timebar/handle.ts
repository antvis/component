import { Rect } from '@antv/g';
import { ChartModeHandle, TimeModeHandle } from '../../../../src/ui/timebar/handle';
import { it } from '../../utils';

export const TimebarHandle = it({ width: 50, height: 80 }, (group) => {
  group.appendChild(
    new Rect({
      style: {
        width: 50,
        height: 80,
        fill: '#72cdf6',
      },
    })
  );

  group.appendChild(new TimeModeHandle({ style: { cx: 10, cy: 10 } }));

  group.appendChild(new ChartModeHandle({ style: { x: 10, y: 50, type: 'start' } }));

  group.appendChild(new ChartModeHandle({ style: { x: 25, y: 50, type: 'end' } }));

  group.appendChild(new ChartModeHandle({ style: { x: 40, y: 50, type: 'end', iconSize: 20 } }));

  return group;
});
