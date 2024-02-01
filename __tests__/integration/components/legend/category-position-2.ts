import { Group } from '@antv/g';
import { Category, createItemData } from './utils';
import { colors } from './data';

export const CategoryPosition2 = () => {
  const group = new Group();

  const g = group.appendChild(
    new Group({
      style: {
        transform: 'translate(50, 50)',
      },
    })
  );

  g.appendChild(
    new Category({
      style: {
        showTitle: false,
        data: createItemData(20),
        x: 50,
        y: 50,
        layout: 'grid',
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

CategoryPosition2.tags = ['分类图例', '图例位置', '嵌套分组', '偏移'];
