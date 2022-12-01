import { Group } from '@antv/g';
import { Category, createItemData } from './utils';
import { colors } from './data';

export const CategoryLayout5 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        layout: 'grid',
        titleText: 'Legend Title',
        width: 455,
        height: 50,
        gridCol: 6,
        gridRow: 1,
        data: createItemData(6),
        itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
        itemValue: '',
      },
    })
  );

  return group;
};

CategoryLayout5.tags = ['分类图例', '布局', '网格布局', '横向布局', '单行布局'];
