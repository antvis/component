import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout11 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        y: 30,
        data: flowItemData,
        layout: 'flex',
        width: 600,
        height: 100,
        gridRow: 2,
        gridCol: 4,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  return group;
};

CategoryLayout11.tags = ['分类图例', '图例组', '流式布局', '列数限制', '换行'];
