import { Group } from '@antv/g';
import { Category, createItemData } from './utils';
import { colors } from './data';

export const CategoryLayout4 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: createItemData(20),
        style: {
          layout: 'grid',
          titleText: 'Legend Title',
          width: 455,
          height: 50,
          gridCol: 6,
          gridRow: 1,
          itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
          itemValue: '',
        },
      },
    })
  );

  return group;
};

CategoryLayout4.tags = ['分类图例', '布局', '网格布局', '横向布局', '分页'];
