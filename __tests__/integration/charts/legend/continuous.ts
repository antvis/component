import { Group, Rect } from '@antv/g';
import { data } from '../../utils';
import { Continuous } from './utils';

export const ContinuousDemo = () => {
  const group = new Group({
    style: {
      width: 580,
      height: 400,
    },
  });

  const createContinuous = (args: any) => {
    const { x, y, width, height } = args;
    group.appendChild(new Rect({ style: { x, y, width, height, stroke: 'red' } }));
    return group.appendChild(
      new Continuous({
        style: {
          data: [{ value: 0 }, { value: 250 }, { value: 500 }, { value: 750 }, { value: 1000 }],
          titleText: 'Title',
          handleMarkerSize: 30,
          labelShowTick: true,
          labelTickLength: '110%',
          handleFormatter: (str: any) => `${str}°C`,
          ...args,
        },
      })
    );
  };

  createContinuous({ step: 100, width: 400, height: 80, defaultValue: [200, 500], labelDirection: 'positive' });

  createContinuous({
    x: 0,
    y: 80,
    step: 50,
    titleText: '',
    defaultValue: [250, 500],
    labelDirection: 'negative',
    width: 400,
    height: 80,
  });

  createContinuous({
    x: 0,
    y: 160,
    defaultValue: [0, 1],
    block: true,
    type: 'size',
    data: data(11, 1),
    width: 400,
    height: 100,
    labelDirection: 'negative',
    showIndicator: false,
    labelAlign: 'range',
    labelFilter: (_: any, i: number) => i !== 2,
    labelFormatter: ({ range: [min, max] }: any) => {
      return `< ${max.toPrecision(1)}`;
    },
  });

  createContinuous({
    x: 0,
    y: 260,
    slidable: false,
    width: 400,
    height: 50,
    showHandle: false,
    showLabel: false,
  });

  createContinuous({
    x: 0,
    y: 340,
    data: data(11, 1),
    block: true,
    slidable: false,
    width: 400,
    height: 60,
    showHandle: false,
    labelAlign: 'value',
    labelFormatter: () => 'label',
    indicatorPadding: [6, 4],
  });

  createContinuous({
    x: 410,
    y: 0,
    orient: 'vertical',
    width: 80,
    height: 400,
    handleShowLabel: false,
    defaultValue: [200, 500],
  });

  createContinuous({
    x: 500,
    y: 0,
    orient: 'vertical',
    width: 80,
    height: 400,
    handleShowLabel: false,
    labelDirection: 'negative',
    defaultValue: [200, 500],
  });

  return group;
};
