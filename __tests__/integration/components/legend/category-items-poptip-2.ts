import { Group } from '@antv/g';
import { CategoryItems } from './utils';
import { flowItemData } from './data';

export const CategoryItemsPoptip2 = () => {
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
          position: 'top',
          offset: [0, 30],
        },
      },
    })
  );
  return group;
};
