import { Group } from '@antv/g';
import { Category, createItemData } from './utils';
import { colors } from './data';

export const CategoryPosition3 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        x: 100,
        y: 100,
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

CategoryPosition3.tags = ['分类图例', '图例位置', '偏移'];
