import { Group } from '@antv/g';
import { CategoryItems } from './utils';
import { flowItemData } from './data';

export const CategoryItemsPoptip5 = () => {
  const group = new Group();
  const colors = ['red', 'orange', 'green', 'blue', 'purple'];

  group.appendChild(
    new CategoryItems({
      style: {
        data: flowItemData,
        layout: 'flex',
        itemLabelFill: 'red',
        itemValueFill: 'green',
        colPadding: 10,
        gridRow: 2,
        gridCol: 5,
        width: 650,
        height: 50,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        poptip: {
          follow: true,
          offset: [15, 15],
          visibility: 'hidden', // 默认隐藏，可通过交互显示
        },
      },
    })
  );

  return group;
};

CategoryItemsPoptip5.tags = ['分类图例', '图例组', 'poptip', '跟随鼠标'];
