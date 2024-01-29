import { it } from '../../utils';
import { Timebar } from '../../../../src/ui/timebar';

export const TimebarBasic = it({ width: 500, height: 150 }, (group) => {
  const start = new Date('2023-08-01');
  const interval = 'day';
  const diff = 3600 * 24 * 1000;
  const data = [10, 2, 3, 4, 15, 10, 5, 0, 3, 1].map((value, index) => ({
    time: new Date(start.getTime() + index * diff),
    value,
  }));
  group.appendChild(
    new Timebar({
      style: {
        x: 10,
        type: 'chart',
        width: 500,
        height: 150,
        data,
        interval,
        loop: true,
        controllerIconSpacing: 5,
        values: [data[1].time, data[5].time],
        onChange: (value) => {
          console.log(
            'onChange',
            (Array.isArray(value) ? value : [value]).map((d) => (d as Date).toLocaleString())
          );
        },
        onReset: () => {
          console.log('onReset');
        },
        onSpeedChange: (speed) => {
          console.log('onSpeedChange', speed);
        },
        onBackward: () => {
          console.log('onBackward');
        },
        onPlay: () => {
          console.log('onPlay');
        },
        onPause: () => {
          console.log('onPause');
        },
        onForward: () => {
          console.log('onForward');
        },
        onSelectionTypeChange: (type) => {
          console.log('onSelectionTypeChange', type);
        },
        onChartTypeChange: (type) => {
          console.log('onChartTypeChange', type);
        },
      },
    })
  );
});
