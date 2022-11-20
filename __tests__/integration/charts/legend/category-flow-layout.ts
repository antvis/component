import { Group } from '@antv/g';
import { Category as C, smooth } from './utils';
import { flowItemData } from './data';

export const CategoryFlow = () => {
  const group = new Group();

  const createCategory = (args: any) => {
    return group.appendChild(
      new C({
        style: {
          layout: 'flex',
          width: 500,
          height: 40,
          data: flowItemData,
          ...args,
        },
      })
    );
  };

  const colors = ['#5781f0', '#70d2a0', '#556484', '#efb745', '#5f4fee'];
  createCategory({
    titleText: 'Legend Title',
    width: 1000,
    itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
    itemValue: '',
  });

  createCategory({
    y: 40,
    titleText: 'Legend Title',
    width: 600,
    itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
    itemValue: '',
  });

  createCategory({
    y: 80,
    titleText: 'Legend Title',
    orient: 'vertical',
    width: 600,
    rowPadding: 10,
    colPadding: 10,
    itemSpacing: 5,
    itemMarkerStroke: (_: any, i: number) => colors[i % colors.length],
    itemMarkerLineWidth: 3,
    itemMarkerFill: 'transparent',
    itemValue: '',
    itemMarkerD: smooth(6, 3, 6),
  });

  return group;
};
