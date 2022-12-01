import { Group } from '@antv/g';
import { flowItemData, colors } from './data';
import { Category } from './utils';

export const CategoryLayout33 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        layout: 'flex',
        gridRow: 2,
        gridCol: 4,
        height: 100,
        width: 500,
        data: flowItemData,
        titleText: 'Legend Title',
        itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
      },
    })
  );

  return group;
};

CategoryLayout33.tags = ['分类图例', '流式布局', '单行布局'];
