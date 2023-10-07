import { Group, Path } from '@antv/g';
import { Category, createItemData, smooth } from './utils';
import { colors } from './data';

export const CategoryLayout7 = () => {
  const group = new Group({
    style: {
      width: 455,
      height: 70,
    },
  });

  group.appendChild(
    new Category({
      style: {
        data: createItemData(20),
        layout: 'grid',
        titleText: 'Legend Title',
        orientation: 'vertical',
        width: 455,
        height: 50,
        gridCol: 6,
        gridRow: 2,
        itemMarkerStroke: (_: any, i: number) => colors[i % colors.length],
        itemMarkerLineWidth: 3,
        itemMarkerFill: 'transparent',
        itemMarker: () => () =>
          new Path({
            style: {
              path: smooth(0, 0, 6),
            },
          }),
        itemValueText: '',
      },
    })
  );

  return group;
};

CategoryLayout7.tags = ['分类图例', '布局', '网格布局', '自定义图标', '换行', '纵向分页'];
