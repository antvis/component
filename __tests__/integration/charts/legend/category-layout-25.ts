import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout25 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        y: 30,
        data: flowItemData,
        layout: 'grid',
        orient: 'vertical',
        width: 300,
        height: 80,
        gridRow: 3,
        gridCol: 2,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  return group;
};

CategoryLayout25.tags = ['分类图例', '图例组', '网格布局', '换列', '分页'];
