import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout12 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        style: {
          y: 30,
          layout: 'flex',
          width: 500,
          height: 100,
          gridRow: 1,
          gridCol: 4,
          itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        },
      },
    })
  );

  return group;
};

CategoryLayout12.tags = ['分类图例', '图例组', '流式布局', '横向布局', '横向分页'];
