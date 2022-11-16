import { Group } from '@antv/g';
import { Category as C, smooth } from './utils';

export const CategoryGrid = () => {
  const group = new Group();

  const createItemData = (num: number) => {
    return new Array(num).fill(0).map((d, i) => ({
      id: `${i + 1}`,
      label: `${i + 1}-label`,
      value: `${i + 1}-value`,
      extInfo: 'further text',
    }));
  };

  const createCategory = (args: any) => {
    return group.appendChild(
      new C({
        style: {
          data: createItemData(20),
          ...args,
        },
      })
    );
  };

  const colors = ['#5781f0', '#70d2a0', '#556484', '#efb745', '#5f4fee'];
  createCategory({
    titleText: 'Legend Title',
    width: 400,
    height: 50,
    gridCol: 6,
    gridRow: 1,
    itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
    itemValue: '',
  });

  createCategory({
    y: 100,
    titleText: 'Legend Title',
    width: 400,
    height: 50,
    gridCol: 6,
    gridRow: 2,
    itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
    itemValue: '',
  });

  createCategory({
    y: 200,
    titleText: 'Legend Title',
    orient: 'vertical',
    width: 400,
    height: 50,
    gridCol: 6,
    gridRow: 2,
    itemMarkerStroke: (_: any, i: number) => colors[i % colors.length],
    itemMarkerLineWidth: 3,
    itemMarkerFill: 'transparent',
    itemValue: '',
    itemMarkerD: smooth(6, 3, 6),
  });

  createCategory({
    y: 300,
    orient: 'vertical',
    width: 80,
    height: 128,
    navLoop: true,
    gridRow: 8,
    gridCol: 1,
    itemMarkerStroke: (_: any, i: number) => colors[i % colors.length],
    itemMarkerLineWidth: 3,
    itemMarkerFill: 'transparent',
    itemValue: '',
  });

  return group;
};
