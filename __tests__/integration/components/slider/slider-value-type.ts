import { Line } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';
import { it } from '../../utils';

export const SliderValueType = it({ width: 320, height: 50 }, (group) => {
  group.appendChild(
    new Slider({
      style: {
        x: 10,
        y: 10,
        type: 'value',
        values: [0, 0.5],
        trackLength: 300,
        trackSize: 50,
        handleIconShape: (type) =>
          new Line({
            style: {
              x1: 0,
              y1: -25,
              x2: 0,
              y2: 25,
              lineWidth: 2,
              stroke: '#c8c8c8',
            },
          }),
        onChange: (values) => {
          console.log(values);
        },
        showLabel: false,
        selectionFill: '#fff',
        selectionFillOpacity: 0.5,
        sparklineAreaStroke: '#d6e4fd',
        sparklineAreaOpacity: 1,
        sparklineAreaFill: '#d6e4fd',
        sparklineData: [[10, 2, 3, 4, 15, 10, 5, 0, 3, 1]],
      },
    })
  );

  return group;
});
