import { Group, Image, Rect, Text } from '@antv/g';
import { CategoryItems as CIs } from './utils';

export const CategoryItems2 = () => {
  const group = new Group({});
  const colors = ['red', 'orange', 'green', 'blue', 'purple'];
  const itemsData = [
    {
      label: 'Middle East',
    },
    {
      label: 'South Asia',
    },
    {
      label: 'East Asia',
    },
    {
      label: 'Europe(and colonial offshoots)',
    },
    {
      label: 'Sub-Saharan Africa',
    },
    {
      label: 'pre-colonial Americas',
    },
    {
      label: 'the Steppes',
      value: '100',
    },
  ];

  const createItems = (args: any) => {
    return group.appendChild(
      new CIs({
        style: {
          data: itemsData,
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
    itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
  });

  createItems({
    x: 10,
    y: 50,
    itemSpacing: [0, 10],
    itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
  });

  createItems({
    x: 10,
    y: 90,
    itemSpacing: [5, 10],
    colPadding: 10,
    itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
  });

  createItems({
    x: 10,
    y: 130,
    colPadding: 10,
    itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
  });

  createItems({
    x: 10,
    y: 170,
    gridRow: 2,
    gridCol: 5,
    colPadding: 10,
    itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
  });

  return group;
};
