import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout1 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        style: {
          layout: 'flex',
          height: 40,
          titleText: 'Legend Title',
          width: 1000,
          itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
          itemValue: '',
        },
      },
    })
  );

  return group;
};

CategoryLayout1.tags = ['分类图例', '布局', '流式布局', '横向布局'];
