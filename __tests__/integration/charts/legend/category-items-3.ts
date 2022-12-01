import { Group, Rect, Circle } from '@antv/g';
import { CategoryItems, createItemData } from './utils';

export const CategoryItems3 = () => {
  const group = new Group();

  group.appendChild(
    new CategoryItems({
      style: {
        gridCol: 1,
        gridRow: 5,
        width: 155,
        height: 210,
        rowPadding: 10,
        orient: 'vertical',
        navDuration: 10000,
        itemMarker: (_: any, index: number) =>
          index % 2 === 0
            ? () => new Rect({ style: { width: 16, height: 16, fill: 'red' } })
            : () => new Circle({ style: { cx: 0, cy: 0, r: 8, fill: 'red' } }),
        itemMarkerFill: (_: any, index: number) => (index % 2 === 0 ? 'red' : 'green'),

        layout: 'grid',
        data: createItemData(20),
        itemLabelFill: 'red',
        itemValueFill: 'green',
        colPadding: 10,
      },
    })
  );

  return group;
};

CategoryItems3.tags = ['分类图例', '图例组', '网格布局', '纵向分页', '自定义图标', '图标样式回调'];
