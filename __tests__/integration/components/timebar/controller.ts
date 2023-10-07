import { it } from '../../utils';
import { Controller } from '../../../../src/ui/timebar/controller';

export const TimebarController = it((group) => {
  group.appendChild(
    new Controller({
      style: {
        x: 0,
        y: 0,
        width: 300,
        height: 50,
        align: 'left',
        onChange: (type, value) => {
          console.log(type, value);
        },
      },
    })
  );
  group.appendChild(
    new Controller({
      style: {
        x: 0,
        y: 50,
        width: 300,
        height: 50,
        speed: 1.5,
        state: 'play',
        align: 'center',
      },
    })
  );
  group.appendChild(
    new Controller({
      style: {
        x: 0,
        y: 100,
        width: 300,
        height: 50,
        speed: 2,
        align: 'right',
        chartType: 'column',
        selectionType: 'value',
      },
    })
  );
});
