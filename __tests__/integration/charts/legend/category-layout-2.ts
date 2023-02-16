import { Group } from '@antv/g';
import { flowItemData, colors } from './data';
import { Category } from './utils';

export const CategoryLayout2 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        style: {
          layout: 'flex',
          height: 40,
          titleText: 'Legend Title',
          width: 600,
          itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
          itemValue: '',
        },
      },
    })
  );

  return group;
};

CategoryLayout2.tags = ['分类图例', '布局', '流式布局', '横向布局', '分页'];
