import { Group, Path } from '@antv/g';
import { CategoryItems, createItemData } from './utils';
import { circle, triangle, diamond } from '../../../../src/ui/marker/symbol';

export const CategoryItems11 = () => {
  const group = new Group({
    style: {
      width: 100,
      height: 20,
    },
  });

  const colors = ['orange', 'green'];
  const width = 600;
  const height = 30;

  group.appendChild(
    new CategoryItems({
      style: {
        data: createItemData(5).slice(1, 2),
        width,
        height,
        itemLabelFill: 'red',
        itemValueFill: 'green',
        colPadding: 5,
        itemMarker: (d: any, i: number) => () =>
          new Path({ style: { path: [circle, triangle, diamond][i % 3](0, 0, 6) } }),
        itemMarkerStroke: (_: any, index: number) => colors[index % colors.length],
        itemMarkerStrokeWidth: 2,
      },
    })
  );

  return group;
};

CategoryItems11.tags = ['分类图例', '图例组'];
