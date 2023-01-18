import { Group } from '@antv/g';
import { flowItemData, colors } from './data';
import { Category } from './utils';

export const CategoryLayout34 = () => {
  const group = new Group({
    style: {
      width: 600,
      height: 80,
    },
  });

  group.appendChild(
    new Category({
      style: {
        layout: 'flex',
        height: 40,
        data: flowItemData,
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
        navButtonFillOpacity: 0.5,
      },
    })
  );

  return group;
};

CategoryLayout34.tags = ['分类图例', '流式布局', '单行布局'];
