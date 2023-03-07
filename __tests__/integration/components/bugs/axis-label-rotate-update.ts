import { Group, Rect } from '@antv/g';
import { Axis } from '../../../../src';
import { Button } from '../../../../src/ui/button';
import { Text } from '../../../../src/shapes';

export const AxisLabelRotateUpdate = () => {
  const group = new Group({
    style: {
      width: 800,
      height: 100,
    },
  });

  const axis = group.appendChild(
    new Axis({
      style: {
        animate: { duration: 300 },
        labelOverlap: [{ type: 'rotate', optionalAngles: [0, 10, 20, 30, 40, 45, 60, 90] }],
        showLabel: true,
        showGrid: false,
        showTick: true,
        showLine: true,
        data: [
          { value: 0, label: 'October', id: '0' },
          { value: 0.08493150684931507, label: 'November', id: '1' },
          { value: 0.16712328767123288, label: 'December', id: '2' },
          { value: 0.25205479452054796, label: '2012', id: '3' },
          { value: 0.336986301369863, label: 'February', id: '4' },
          { value: 0.41643835616438357, label: 'March', id: '5' },
          { value: 0.5013698630136987, label: 'April', id: '6' },
          { value: 0.5835616438356165, label: 'May', id: '7' },
          { value: 0.6684931506849315, label: 'June', id: '8' },
          { value: 0.7506849315068493, label: 'July', id: '9' },
          { value: 0.8356164383561644, label: 'August', id: '10' },
          { value: 0.9205479452054794, label: 'September', id: '11' },
        ],
        endPos: [600, 50],
        labelAlign: 'horizontal',
        labelDirection: 'positive',
        labelFill: '#000',
        labelFillOpacity: 0.65,
        labelFontSize: 12,
        labelFontWeight: 'lighter',
        labelSpacing: 12,
        lineArrow: undefined,
        lineLineWidth: 0.5,
        lineOpacity: 0,
        lineStroke: '#000',
        lineStrokeOpacity: 0.45,
        startPos: [45, 50],
        tickDirection: 'positive',
        tickLength: 4,
        tickLineWidth: 1,
        tickStroke: '#000',
        tickStrokeOpacity: 0.25,
        type: 'linear',
      },
    })
  );

  const update = (animate: any = undefined) => {
    axis.update({ endPos: [800, 50] }, animate);
  };

  const reset = (animate: any = undefined) => {
    axis.update({ endPos: [600, 50] }, animate);
  };

  group.appendChild(new Button({ style: { text: 'update', onClick: () => update() } }));

  group.appendChild(new Button({ style: { x: 80, text: 'reset', onClick: () => reset() } }));

  if (process.env.NODE_ENV === 'test') {
    update(false);
    reset(false);
  }

  return group;
};
