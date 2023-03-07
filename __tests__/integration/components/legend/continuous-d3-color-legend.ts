import { Group } from '@antv/g';
import { gradient } from '../../utils';
import { Continuous } from './utils';

export const ContinuousD3ColorLegend = () => {
  const group = new Group({
    style: {
      width: 400,
      height: 240,
    },
  });

  group.appendChild(
    new Continuous({
      style: {
        showHandle: false,
        showLabel: true,
        showTick: true,
        labelFilter: (d: any, i: number) => i > 0 && i < 9,
        data: new Array(10).fill(0).map((d: any, i: number) => ({ value: i + 1 })),
        width: 400,
        height: 60,
        block: true,
        color: gradient([252, 251, 253], [57, 5, 121], 10).map((color) => `rgb(${color.join(',')})`),
        orientation: 'horizontal',
        titleText: 'Unemployment rate(%)',
        labelSpacing: 8,
        labelAlign: 'value',
      },
    })
  );

  group.appendChild(
    new Continuous({
      style: {
        data: [69, 76, 85, 91, 95, 101, 108, 115, 124, 131].map((d: any, i: number) => ({ value: i })),
        labelFilter: (d: any, i: number) => i > 0 && i < 9,
        showLabel: true,
        showHandle: false,
        showTick: true,
        x: 0,
        y: 60,
        width: 400,
        height: 60,
        block: true,
        color: ['#c54a53', '#e3754f', '#f1b16e', '#f9e195', '#ffffc6', '#e9f4a3', '#b5dca9', '#7dc0a5', '#4b86b8'],
        orientation: 'horizontal',
        titleText: 'Height (cm)',
        labelSpacing: 8,
        labelAlign: 'value',
      },
    })
  );

  group.appendChild(
    new Continuous({
      style: {
        data: [2, 2.5, 3.1, 3.5, 3.9, 6, 7, 8, 9.5, 10].map((d: any, i: number) => ({ value: i, label: d })),
        labelFilter: (d: any, i: number) => i > 0 && i < 9,
        showTick: true,
        showLabel: true,
        showHandle: false,
        x: 0,
        y: 120,
        width: 400,
        height: 60,
        block: true,
        color: ['#963435', '#ba6c58', '#deab8c', '#f3ddcc', '#f7f7f7', '#d8e3ee', '#a4c3d9', '#6590bb', '#4164a2'],
        orientation: 'horizontal',
        titleText: 'Unemployment rate(%)',
        labelSpacing: 8,
        labelAlign: 'value',
      },
    })
  );

  group.appendChild(
    new Continuous({
      style: {
        data: [2, 2.5, 3.1, 3.5, 3.9, 6, 7, 8, 9.5, 10].map((d: any, i: number) => ({ value: d })),
        labelFilter: (d: any, i: number) => i > 0 && i < 9,
        showTick: true,
        showHandle: false,
        showLabel: true,
        x: 0,
        y: 180,
        width: 400,
        height: 60,
        block: true,
        color: ['#963435', '#ba6c58', '#deab8c', '#f3ddcc', '#f7f7f7', '#d8e3ee', '#a4c3d9', '#6590bb', '#4164a2'],
        orientation: 'horizontal',
        titleText: 'Unemployment rate(%)',
        labelSpacing: 8,
        labelAlign: 'value',
      },
    })
  );

  return group;
};

ContinuousD3ColorLegend.tags = ['图例', 'D3'];
