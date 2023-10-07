import { Group } from '@antv/g';
import { Axis } from '../../../../src';
import { Button } from '../../../../src/ui/button';
import { timeout } from '../../utils';

export const AxisLabelOverlapUpdate = () => {
  const group = new Group({});

  const data1 = [
    { value: 1, label: '0', id: '0' },
    { value: 0.8420194215003984, label: '500k', id: '1' },
    { value: 0.6840388430007969, label: '1M', id: '2' },
    { value: 0.5260582645011953, label: '1.5M', id: '3' },
    { value: 0.36807768600159374, label: '2M', id: '4' },
    { value: 0.21009710750199218, label: '2.5M', id: '5' },
    { value: 0.05211652900239061, label: '3M', id: '6' },
  ];

  const data2 = [
    { value: 0.8856922567959995, label: '1.2M', id: '0' },
    { value: 0.7615543466635935, label: '1.4M', id: '1' },
    { value: 0.6374164365311876, label: '1.6M', id: '2' },
    { value: 0.5132785263987817, label: '1.8M', id: '3' },
    { value: 0.38914061626637575, label: '2M', id: '4' },
    { value: 0.2650027061339698, label: '2.2M', id: '5' },
    { value: 0.14086479600156387, label: '2.4M', id: '6' },
    { value: 0.016726885869157937, label: '2.6M', id: '7' },
  ];

  const axis = group.appendChild(
    new Axis({
      style: {
        showLabel: true,
        showGrid: false,
        showTick: true,
        showLine: false,
        animate: { duration: 300 },
        labelOverlap: [{ type: 'hide' }],
        data: data1,
        tickStroke: '#000',
        tickStrokeOpacity: 0.25,
        tickLineWidth: 1,
        tickLength: 4,
        labelFill: '#000',
        labelFillOpacity: 0.65,
        labelFontSize: 12,
        labelFontWeight: 'lighter',
        labelSpacing: 12,
        labelAlign: 'horizontal',
        type: 'linear',
        gridLength: 395,
        startPos: [60, 40],
        endPos: [60, 435],
      },
    })
  );

  const update = (animate: any = undefined) => {
    axis.update({ data: data2 }, animate);
  };

  const reset = (animate: any = undefined) => {
    // @ts-ignore
    axis.update({ data: data1 }, animate);
  };

  group.appendChild(new Button({ style: { text: 'update', onClick: () => update() } }));

  group.appendChild(new Button({ style: { x: 80, text: 'reset', onClick: () => reset() } }));

  if (process.env.NODE_ENV === 'test') {
    update(false);
  }

  return group;
};
