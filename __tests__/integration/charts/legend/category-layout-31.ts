import { Group } from '@antv/g';
import { flowItemData, colors } from './data';
import { Category } from './utils';

export const CategoryLayout31 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        layout: 'flex',
        width: 200,
        height: 80,
        gridRow: 10,
        gridCol: 1,
        data: flowItemData,
        titleText: 'Legend Title',
        itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
      },
    })
  );

  return group;
};

CategoryLayout31.tags = ['分类图例', '流式布局', '单列布局', '分页', '高度不足'];
