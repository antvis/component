import { Group } from '@antv/g';
import { flowItemData } from './data';
import { CategoryItems } from './utils';

export const CategoryItems6 = () => {
  const group = new Group();

  const colors = ['red', 'orange', 'green', 'blue', 'purple'];

  group.appendChild(
    new CategoryItems({
      style: {
        layout: 'flex',
        data: flowItemData,
        itemLabelFill: 'red',
        itemValueFill: 'green',
        width: 1000,
        height: 100,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  return group;
};

CategoryItems6.tags = ['分类图例', '图例组', '流式布局', '单行布局'];
