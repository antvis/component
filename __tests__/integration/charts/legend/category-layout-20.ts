import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout20 = () => {
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
          height: 60,
          gridRow: 2,
          gridCol: 4,
          itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        },
      },
    })
  );

  return group;
};

CategoryLayout20.tags = ['分类图例', '图例组', '网格布局', '换行', '缩略', '列数限制'];
