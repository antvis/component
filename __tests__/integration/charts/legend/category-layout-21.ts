import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout21 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        style: {
          y: 30,
          layout: 'grid',
          width: 300,
          height: 60,
          gridRow: 2,
          gridCol: 3,
          itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        },
      },
    })
  );

  return group;
};

CategoryLayout21.tags = ['分类图例', '图例组', '网格布局', '换行', '缩略', '行数限制'];
