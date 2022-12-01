import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout9 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        layout: 'flex',
        width: 1000,
        height: 100,
        gridRow: 1,
        gridCol: undefined,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  return group;
};

CategoryLayout9.tags = ['分类图例', '图例组', '流式布局', '单行布局'];
