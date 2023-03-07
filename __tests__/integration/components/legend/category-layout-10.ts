import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout10 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        y: 30,
        layout: 'flex',
        width: 400,
        height: 100,
        gridRow: 2,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  return group;
};

CategoryLayout10.tags = ['分类图例', '图例组', '流式布局', '宽度限制', '换行'];
