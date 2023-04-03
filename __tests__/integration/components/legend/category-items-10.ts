import { Group } from '@antv/g';
import { CategoryItems, createItemData } from './utils';

export const CategoryItems10 = () => {
  const group = new Group({
    style: {
      width: 100,
      height: 100,
    },
  });

  const colors = ['orange', 'green'];
  const width = 100;
  const height = 90;
  const gridRow = 10;
  const gridCol = 1;

  const items = group.appendChild(
    new CategoryItems({
      style: {
        data: createItemData(5),
        width,
        height,
        gridRow,
        gridCol,
        layout: 'grid',
        orientation: 'vertical',
        itemLabelFill: 'red',
        itemValueFill: 'green',
        colPadding: 10,
        rowPadding: 5,
        itemMarkerStroke: (_: any, index: number) => colors[index % colors.length],
        itemMarkerStrokeWidth: 2,
      },
    })
  );

  items.update({
    itemMarkerStroke: (d: any, i: number) => (i % 2 === 0 ? 'pink' : 'purple'),
  });

  return group;
};

CategoryItems10.tags = ['分类图例', '图例组', '网格布局', '纵向分页', '图标样式回调', '样式属性更新'];
