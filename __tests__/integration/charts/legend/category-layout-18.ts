import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout18 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        style: {
          y: 30,
          layout: 'flex',
          orientation: 'vertical',
          width: 400,
          height: 300,
          gridRow: 3,
          gridCol: 2,
          itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        },
      },
    })
  );

  return group;
};

CategoryLayout18.tags = ['分类图例', '图例组', '流式布局', '纵向分页', '分页'];
