import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout14 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        style: {
          y: 30,
          layout: 'flex',
          width: 600,
          height: 100,
          gridRow: 2,
          gridCol: 3,
          itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        },
      },
    })
  );

  return group;
};

CategoryLayout14.tags = ['分类图例', '图例组', '流式布局', '横向布局', '纵向分页', '换行'];
