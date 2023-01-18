import { Group } from '@antv/g';
import { data } from '../../utils';
import { Continuous } from './utils';

export const ContinuousDemo = () => {
  const group = new Group({
    style: {
      width: 730,
      height: 750,
    },
  });

  const createContinuous = (args: any) => {
    return group.appendChild(
      new Continuous({
        style: {
          x: 50,
          y: 50,
          width: 400,
          height: 300,
          data: [{ value: 0 }, { value: 250 }, { value: 500 }, { value: 750 }, { value: 1000 }],
          titleText: 'Title',
          titleSpacing: 20,
          titleInset: [0, 0, 0, 12],
          ribbonLen: 200,
          ribbonSize: 30,
          handleMarkerSize: 30,
          handleFormatter: (str: any) => `${str}°C`,
          ribbonTrackFill: 'pink',
          ...args,
        },
      })
    );
  };

  createContinuous({ step: 100, defaultValue: [200, 500], labelDirection: 'negative' });

  createContinuous({
    x: 300,
    y: 450,
    step: 50,
    titleText: '',
    defaultValue: [250, 500],
    labelDirection: 'negative',
    ribbonLen: 400,
  });

  createContinuous({
    x: 75,
    y: 150,
    orient: 'vertical',
    slidable: false,
    defaultValue: [200, 500],
  });

  createContinuous({
    x: 300,
    y: 150,
    defaultValue: [0, 1],
    block: true,
    type: 'size',
    data: data(11, 1),
    ribbonLen: 400,
    labelDirection: 'negative',
    showIndicator: false,
    labelFilter: (_: any, i: number) => i !== 2,
    labelFormatter: ({ range: [min, max] }: any) => {
      return `< ${max.toPrecision(1)}`;
    },
  });

  createContinuous({
    x: 300,
    y: 50,
    slidable: false,
    ribbonLen: 400,
    showHandle: false,
    showLabel: false,
  });

  createContinuous({
    x: 300,
    y: 300,
    data: data(11, 1),
    block: true,
    slidable: false,
    ribbonLen: 400,
    showHandle: false,
    // showLabel: false,
    labelAlign: 'value',
    labelFormatter: () => 'label',
    indicatorPadding: [6, 4],
  });

  return group;
};
