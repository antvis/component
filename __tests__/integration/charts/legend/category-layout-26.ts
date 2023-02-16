import { Group } from '@antv/g';
import { flowItemData, colors } from './data';
import { Category } from './utils';

export const CategoryLayout26 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        style: {
          layout: 'flex',
          width: 500,
          height: 100,
          gridRow: 2,
          gridCol: 4,
          // itemSpan: [1, 10, 0],
          orientation: 'vertical',
          titleText: 'Legend Title',
          itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
        },
      },
    })
  );

  return group;
};

CategoryLayout26.tags = ['分类图例', '流式布局', '单行布局'];
