import { it } from '../../utils';
import { Timebar } from '../../../../src/ui/timebar';

export const TimebarTime = it((group) => {
  const start = new Date('2023-08-01');
  const diff = 3600 * 24 * 1000;
  const data = [10, 2, 3, 4, 15, 10, 5, 0, 3, 1].map((value, index) => ({
    time: new Date(start.getTime() + index * diff),
    value,
  }));

  group.appendChild(
    new Timebar({
      style: {
        x: 10,
        y: 20,
        data,
        type: 'time',
        height: 50,
        width: 500,
        values: [data[1].time, data[5].time],
      },
    })
  );

  group.appendChild(
    new Timebar({
      style: {
        x: 10,
        y: 90,
        data,
        type: 'time',
        height: 50,
        width: 500,
        values: data[5].time,
        selectionType: 'value',
      },
    })
  );

  group.appendChild(
    new Timebar({
      style: {
        x: 10,
        y: 160,
        data,
        type: 'time',
        height: 50,
        width: 500,
        values: data[6].time,
        selectionType: 'value',
        speed: 1.5,
        state: 'play',
      },
    })
  );
});
