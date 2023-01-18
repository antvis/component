import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout17 = () => {
  const group = new Group({
    style: {
      width: 210,
      height: 110,
    },
  });

  group.appendChild(
    new Category({
      style: {
        y: 30,
        data: flowItemData,
        layout: 'flex',
        orient: 'vertical',
        width: 200,
        height: 80,
        gridRow: 10,
        gridCol: 1,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  return group;
};

CategoryLayout17.tags = ['分类图例', '图例组', '流式布局', '纵向布局', '纵向分页', '行高限制'];
