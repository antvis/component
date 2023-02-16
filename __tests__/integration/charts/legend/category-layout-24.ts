import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout24 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        style: {
          y: 30,
          layout: 'grid',
          orientation: 'vertical',
          width: 300,
          height: 80,
          gridRow: 4,
          gridCol: 2,
          itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        },
      },
    })
  );

  return group;
};

CategoryLayout24.tags = ['分类图例', '图例组', '网格布局', '换列', '多列'];
