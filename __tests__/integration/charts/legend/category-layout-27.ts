import { Group } from '@antv/g';
import { flowItemData, colors } from './data';
import { Category } from './utils';

export const CategoryLayout27 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        style: {
          layout: 'flex',
          gridRow: 2,
          gridCol: undefined,
          height: 100,
          width: 300,
          titleText: 'Legend Title',
          itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
        },
      },
    })
  );

  return group;
};

CategoryLayout27.tags = ['分类图例', '流式布局', '列数无限制'];
