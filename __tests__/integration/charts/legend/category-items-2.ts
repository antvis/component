import { Group, Image, Rect, Text } from '@antv/g';
import { CategoryItems as CIs } from './utils';
import { flowItemData } from './data';

export const CategoryItems2 = () => {
  const group = new Group({});
  const colors = ['red', 'orange', 'green', 'blue', 'purple'];

  const createItems = (args: any) => {
    return group.appendChild(
      new CIs({
        style: {
          data: flowItemData,
          itemLabelFill: 'red',
          itemValueFill: 'green',
          itemMarkerFill: 'orange',
          ...args,
        },
      })
    );
  };

  createItems({
    x: 10,
    y: 10,
    colPadding: 10,
    rowPadding: 5,
    maxWidth: 1000,
    itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
  });

  createItems({
    x: 10,
    y: 50,
    maxWidth: 1000,
    itemSpacing: [0, 10],
    itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
  });

  createItems({
    x: 10,
    y: 90,
    maxWidth: 1000,
    itemSpacing: [5, 10],
    colPadding: 10,
    itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
  });

  createItems({
    x: 10,
    y: 130,
    maxWidth: 1000,
    colPadding: 10,
    itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
  });

  createItems({
    x: 10,
    y: 170,
    colPadding: 10,
    maxWidth: 650,
    maxHeight: 50,
    itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
  });

  return group;
};
