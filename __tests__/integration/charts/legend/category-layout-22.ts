import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout22 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        style: {
          y: 30,
          layout: 'grid',
          orientation: 'vertical',
          width: 200,
          height: 200,
          gridRow: 10,
          gridCol: 1,
          itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        },
      },
    })
  );

  return group;
};

CategoryLayout22.tags = ['分类图例', '图例组', '网格布局', '单列布局'];
