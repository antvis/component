import { Group } from '@antv/g';
import { Category, createItemData } from './utils';
import { colors } from './data';

export const CategoryMarker = () => {
  const group = new Group();

  const g1 = group.appendChild(new Group());

  g1.appendChild(
    new Category({
      style: {
        data: createItemData(1),
        layout: 'grid',
        titleText: 'Legend Title',
        width: 455,
        height: 50,
        gridCol: 4,
        gridRow: 1,
        itemMarker: 'square',
        click: () => console.log('click'),
        itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
      },
    })
  );
  return group;
};

CategoryMarker.tags = ['分类图例', '图例位置', '无偏移'];
