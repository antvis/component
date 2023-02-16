import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout23 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: new Array(20).fill(0).map((_, index) => ({
          label: flowItemData[index % flowItemData.length].label,
        })),
        style: {
          y: 30,
          layout: 'grid',
          width: 500,
          height: 100,
          gridCol: 5,
          itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        },
      },
    })
  );

  return group;
};

CategoryLayout23.tags = ['分类图例', '图例组', '网格布局', '单列布局', '横向堆叠', 'BUG'];
