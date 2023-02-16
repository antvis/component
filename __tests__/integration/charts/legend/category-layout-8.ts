import { Group } from '@antv/g';
import { Category, createItemData } from './utils';
import { colors } from './data';

export const CategoryLayout8 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: createItemData(20),
        style: {
          layout: 'grid',
          orientation: 'vertical',
          width: 120,
          height: 128,
          navLoop: true,
          gridRow: 8,
          gridCol: 1,
          itemSpacing: 5,
          itemMarkerStroke: (_: any, i: number) => colors[i % colors.length],
          itemMarkerLineWidth: 3,
          itemMarkerFill: 'transparent',
          itemValue: '',
        },
      },
    })
  );

  return group;
};

CategoryLayout8.tags = ['分类图例', '布局', '网格布局', '自定义图标', '单列布局', '纵向分页'];
