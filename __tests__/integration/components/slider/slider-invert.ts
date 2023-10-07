import { Group, Rect, Line } from '@antv/g';
import { it } from '../../utils';
import { Slider } from '../../../../src/ui/slider';

export const SliderInvert = it({ width: 320, height: 50 }, (group) => {
  const createHandle = (type: string) => {
    const handle = new Group({
      style: {
        cursor: 'ew-resize',
      },
    });
    handle.appendChild(
      new Rect({
        style: {
          x: -5,
          y: -25,
          width: 10,
          height: 50,
          fill: '#fff',
          fillOpacity: 0.5,
        },
      })
    );
    const lineStyle = {
      lineWidth: 1,
      stroke: '#9a9a9a',
    };
    handle.appendChild(
      new Line({
        style: {
          x1: -1,
          y1: -5,
          x2: -1,
          y2: 5,
          ...lineStyle,
        },
      })
    );

    handle.appendChild(
      new Line({
        style: {
          x1: 1,
          y1: 5,
          x2: 1,
          y2: -5,
          ...lineStyle,
        },
      })
    );

    const x = type === 'start' ? 5 : -5;
    handle.appendChild(
      new Line({
        style: {
          x1: x,
          y1: -25,
          x2: x,
          y2: 25,
          lineWidth: 1,
          stroke: '#e8e8e8',
        },
      })
    );

    return handle;
  };

  group.appendChild(
    new Slider({
      style: {
        x: 10,
        y: 10,
        values: [0.25, 0.75],
        trackLength: 300,
        trackSize: 50,
        handleIconShape: (type) => createHandle(type),
        selectionType: 'invert',
        selectionFill: '#fff',
        selectionFillOpacity: 0.5,
        handleIconOffset: 5,
        sparklineAreaStroke: '#d6e4fd',
        sparklineAreaOpacity: 1,
        sparklineAreaFill: '#d6e4fd',
        sparklineData: [[10, 2, 3, 4, 15, 10, 5, 0, 3, 1]],
      },
    })
  );

  return group;
});
