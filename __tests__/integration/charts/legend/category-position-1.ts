import { Group } from '@antv/g';
import { Category, createItemData } from './utils';
import { colors } from './data';

export const CategoryPosition1 = () => {
  const group = new Group();

  const g1 = group.appendChild(new Group());

  g1.appendChild(
    new Category({
      style: {
        layout: 'grid',
        data: createItemData(20),
        titleText: 'Legend Title',
        width: 455,
        height: 50,
        gridCol: 4,
        gridRow: 1,
        itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
      },
    })
  );

  return group;
};

CategoryPosition1.tags = ['分类图例', '图例位置', '无偏移'];
