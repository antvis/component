import { Group } from '@antv/g';
import { CategoryItems, createItemData } from './utils';

export const CategoryItems2 = () => {
  const group = new Group();

  const colors = ['orange', 'green'];
  const width = 355;
  const height = 90;
  const gridRow = 3;
  const gridCol = 3;

  const items = group.appendChild(
    new CategoryItems({
      style: {
        data: createItemData(20),
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
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  items.update({
    itemMarkerFill: (d: any, i: number) => (i % 2 === 0 ? 'pink' : 'purple'),
  });

  return group;
};

CategoryItems2.tags = ['分类图例', '图例组', '网格布局', '纵向分页', '图标样式回调', '样式属性更新'];
