import { it } from '../../utils';
import { Indicator } from '../../../../src/ui/indicator';

export const IndicatorRadius = it((group) => {
  const createIndicator = (args: any) => {
    group.appendChild(
      new Indicator({
        style: {
          x: 10,
          y: 20,
          visibility: 'visible',
          padding: [2, 4],
          radius: 3,
          position: 'right',
          labelText: `Position: ${args.position || 'right'}\nRadius: ${args.radius ?? 3}`,
          ...args,
        },
      })
    );
  };

  createIndicator({});
  createIndicator({ position: 'left', x: 100, y: 60 });
  createIndicator({ position: 'top', x: 60, y: 125 });
  createIndicator({ position: 'bottom', x: 60, y: 130 });

  createIndicator({ radius: 8, x: 120 });
  createIndicator({ radius: 8, position: 'left', x: 210, y: 60 });
  createIndicator({ radius: 8, position: 'top', x: 170, y: 125 });
  createIndicator({ radius: 8, position: 'bottom', x: 170, y: 130 });
});
