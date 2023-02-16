import { Group, Rect, Circle } from '@antv/g';
import { CategoryItems, createItemData } from './utils';

export const CategoryItems3 = () => {
  const group = new Group();

  group.appendChild(
    new CategoryItems({
      style: {
        data: createItemData(20),
        animate: {
          navDuration: 10000,
        },
        style: {
          gridCol: 1,
          gridRow: 5,
          width: 155,
          height: 210,
          rowPadding: 10,
          orientation: 'vertical',
          itemMarker: (_: any, index: number) =>
            index % 2 === 0
              ? () => new Rect({ style: { x: -8, y: -8, width: 16, height: 16, fill: 'red' } })
              : () => new Circle({ style: { cx: 0, cy: 0, r: 8, fill: 'red' } }),
          itemMarkerFill: (_: any, index: number) => (index % 2 === 0 ? 'red' : 'green'),
          layout: 'grid',
          itemLabelFill: 'red',
          itemValueFill: 'green',
          colPadding: 10,
        },
      },
    })
  );

  return group;
};

CategoryItems3.tags = ['分类图例', '图例组', '网格布局', '纵向分页', '自定义图标', '图标样式回调'];
