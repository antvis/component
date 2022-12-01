import { Group } from '@antv/g';
import { Category, createItemData, smooth } from './utils';
import { colors } from './data';

export const CategoryLayout7 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        layout: 'grid',
        data: createItemData(20),
        titleText: 'Legend Title',
        orient: 'vertical',
        width: 455,
        height: 50,
        gridCol: 6,
        gridRow: 2,
        itemMarkerStroke: (_: any, i: number) => colors[i % colors.length],
        itemMarkerLineWidth: 3,
        itemMarkerFill: 'transparent',
        itemValue: '',
        itemMarkerD: smooth(6, 3, 6),
      },
    })
  );

  return group;
};

CategoryLayout7.tags = ['分类图例', '布局', '网格布局', '自定义图标', '换行', '纵向分页'];
