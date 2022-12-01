import { Group, Image, Rect, Text } from '@antv/g';
import { CategoryItems } from './utils';
import { flowItemData } from './data';

export const CategoryItems7 = () => {
  const group = new Group();

  const colors = ['red', 'orange', 'green', 'blue', 'purple'];

  group.appendChild(
    new CategoryItems({
      style: {
        layout: 'flex',
        data: flowItemData,
        itemLabelFill: 'red',
        itemValueFill: 'green',
        colPadding: 10,
        itemSpacing: [0, 10],
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  return group;
};

CategoryItems7.tags = ['分类图例', '图例组', '流式布局', '单行布局', '列间隔', '项目间隔'];
