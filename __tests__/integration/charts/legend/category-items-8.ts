import { Group } from '@antv/g';
import { flowItemData } from './data';
import { CategoryItems } from './utils';

export const CategoryItems8 = () => {
  const group = new Group();
  const colors = ['red', 'orange', 'green', 'blue', 'purple'];

  group.appendChild(
    new CategoryItems({
      style: {
        data: flowItemData,
        style: {
          layout: 'flex',
          itemLabelFill: 'red',
          itemValueFill: 'green',
          colPadding: 10,
          gridRow: 2,
          gridCol: 5,
          width: 650,
          height: 50,
          itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        },
      },
    })
  );

  return group;
};

CategoryItems8.tags = ['分类图例', '图例组', '流式布局', '换行'];
