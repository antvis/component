import { Group, Rect } from '@antv/g';
import { Continuous } from './utils';
import { gradient } from '../../utils';

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
        width: 400,
        height: 60,
        block: true,
        data: new Array(10).fill(0).map((d, i) => ({ value: i + 1 })),
        color: gradient([252, 251, 253], [57, 5, 121], 10).map((color) => `rgb(${color.join(',')})`),
        orient: 'horizontal',
        titleText: 'Unemployment rate(%)',
        labelFilter: (d: any, i: number) => i > 0 && i < 9,
        labelShowTick: true,
        labelSpacing: 8,
        showLabel: true,
        labelAlign: 'value',
        showHandle: false,
      },
    })
  );

  group.appendChild(
    new Continuous({
      style: {
        y: 60,
        width: 400,
        height: 60,
        block: true,
        data: [69, 76, 85, 91, 95, 101, 108, 115, 124, 131].map((d, i) => ({ value: i })),
        color: ['#c54a53', '#e3754f', '#f1b16e', '#f9e195', '#ffffc6', '#e9f4a3', '#b5dca9', '#7dc0a5', '#4b86b8'],
        orient: 'horizontal',
        titleText: 'Height (cm)',
        labelFilter: (d: any, i: number) => i > 0 && i < 9,
        labelShowTick: true,
        labelSpacing: 8,
        showLabel: true,
        labelAlign: 'value',
        showHandle: false,
      },
    })
  );

  group.appendChild(
    new Continuous({
      style: {
        y: 120,
        width: 400,
        height: 60,
        block: true,
        data: [2, 2.5, 3.1, 3.5, 3.9, 6, 7, 8, 9.5, 10].map((d, i) => ({ value: i, label: d })),
        color: ['#963435', '#ba6c58', '#deab8c', '#f3ddcc', '#f7f7f7', '#d8e3ee', '#a4c3d9', '#6590bb', '#4164a2'],
        orient: 'horizontal',
        titleText: 'Unemployment rate(%)',
        labelFilter: (d: any, i: number) => i > 0 && i < 9,
        labelShowTick: true,
        labelSpacing: 8,
        showLabel: true,
        labelAlign: 'value',
        showHandle: false,
      },
    })
  );

  group.appendChild(
    new Continuous({
      style: {
        y: 180,
        width: 400,
        height: 60,
        block: true,
        data: [2, 2.5, 3.1, 3.5, 3.9, 6, 7, 8, 9.5, 10].map((d, i) => ({ value: d })),
        color: ['#963435', '#ba6c58', '#deab8c', '#f3ddcc', '#f7f7f7', '#d8e3ee', '#a4c3d9', '#6590bb', '#4164a2'],
        orient: 'horizontal',
        titleText: 'Unemployment rate(%)',
        labelFilter: (d: any, i: number) => i > 0 && i < 9,
        labelShowTick: true,
        labelSpacing: 8,
        showLabel: true,
        labelAlign: 'value',
        showHandle: false,
      },
    })
  );

  return group;
};

ContinuousD3ColorLegend.tags = ['图例', 'D3'];
