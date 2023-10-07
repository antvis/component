import { it } from '../../utils';
import { Timebar } from '../../../../src/ui/timebar';

export const TimebarChart = it((group) => {
  const start = new Date('2023-08-01');
  const interval = 'day';
  const diff = 3600 * 24 * 1000;
  const data = [10, 2, 3, 4, 15, 10, 5, 0, 3, 10].map((value, index) => ({
    time: new Date(start.getTime() + index * diff),
    value,
  }));
  group.appendChild(
    new Timebar({
      style: {
        x: 10,
        y: 0,
        type: 'chart',
        height: 100,
        width: 500,
        interval,
        data,
        playMode: 'slide',
        loop: true,
        values: [data[1].time, data[8].time],
      },
    })
  );

  group.appendChild(
    new Timebar({
      style: {
        x: 10,
        y: 110,
        height: 100,
        width: 500,
        data,
        interval,
        values: data[5].time,
        type: 'chart',
        selectionType: 'value',
        loop: true,
      },
    })
  );

  group.appendChild(
    new Timebar({
      style: {
        x: 10,
        y: 220,
        height: 100,
        width: 500,
        data,
        interval,
        values: [data[2].time, data[7].time],
        type: 'chart',
        chartType: 'column',
      },
    })
  );

  group.appendChild(
    new Timebar({
      style: {
        x: 10,
        y: 330,
        height: 100,
        width: 500,
        data,
        interval,
        values: data[6].time,
        type: 'chart',
        chartType: 'column',
        selectionType: 'value',
      },
    })
  );
});
