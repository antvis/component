import { Group, Path } from '@antv/g';
import { flowItemData, colors } from './data';
import { Category, smooth } from './utils';

export const CategoryLayout3 = () => {
  const group = new Group({
    style: {
      width: 600,
      height: 60,
    },
  });

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        layout: 'flex',
        height: 40,
        titleText: 'Legend Title',
        orientation: 'vertical',
        width: 600,
        rowPadding: 10,
        colPadding: 10,
        itemSpacing: 5,
        itemMarkerStroke: (_: any, i: number) => colors[i % colors.length],
        itemMarkerLineWidth: 3,
        itemMarkerFill: 'transparent',

        itemMarker: () => () =>
          new Path({
            style: {
              path: smooth(0, 0, 6),
            },
          }),
      },
    })
  );

  return group;
};

CategoryLayout3.tags = ['分类图例', '布局', '流式布局', '横向布局', '自定义图标', '纵向分页'];
