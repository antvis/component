import { Group } from '@antv/g';
import { Category, createItemData } from './utils';
import { colors } from './data';

export const CategoryLayout6 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: createItemData(20),
        style: {
          layout: 'grid',
          titleText: 'Legend Title',
          width: 455,
          height: 50,
          gridCol: 6,
          gridRow: 2,
          itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
          itemValue: '',
        },
      },
    })
  );
  return group;
};

CategoryLayout6.tags = ['分类图例', '布局', '网格布局', '横向布局', '换行', '横向分页'];
