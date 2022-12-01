import { Group } from '@antv/g';
import { CategoryItems, createItemData } from './utils';

export const CategoryItems1 = () => {
  const group = new Group();

  const colors = ['red', 'orange', 'green', 'blue', 'purple'];
  const width = 355;
  const height = 90;
  const gridRow = 3;
  const gridCol = 3;

  group.appendChild(
    new CategoryItems({
      style: {
        width,
        height,
        gridRow,
        gridCol,
        layout: 'grid',
        data: createItemData(20),
        itemLabelFill: 'red',
        itemValueFill: 'green',
        colPadding: 10,
        rowPadding: 5,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  return group;
};

CategoryItems1.tags = ['分类图例', '图例组', '网格布局', '横向分页', '图标样式回调'];
