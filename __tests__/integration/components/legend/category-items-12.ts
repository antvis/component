import { Group, Path } from '@antv/g';
import { circle } from '../../../../src/ui/marker/symbol';
import { CategoryItems } from './utils';

export const CategoryItems12 = () => {
  const group = new Group({
    style: {
      width: 150,
      height: 20,
    },
  });

  const data = [
    { id: 8, label: '8', color: '#5B8FF9' },
    { id: 4, label: '4', color: '#5AD8A6' },
    { id: 6, label: '6', color: '#5D7092' },
    { id: 3, label: '3', color: '#F6BD16' },
    { id: 5, label: '5', color: '#6F5EF9' },
  ];

  group.appendChild(
    new CategoryItems({
      style: {
        data,
        itemMarker: (d: any, i: number) => () => new Path({ style: { path: circle(0, 0, 6) } }),
        itemMarkerStroke: (_: any, index: number) => data[index].color,

        width: 565,
        height: 40,
        x: 0,
        y: 0,
        padding: 8,
        orientation: 'horizontal',
        itemBackgroundFill: 'transparent',
        itemLabelFill: '#000',
        itemLabelFillOpacity: 0.65,
        itemLabelFontSize: 12,
        itemLabelFontWeight: 'normal',
        itemMarkerFillOpacity: 1,
        itemMarkerSize: 8,
        itemSpacing: [5, 8],
        itemValueFill: '#000',
        itemValueFillOpacity: 0.65,
        itemValueFontSize: 12,
        itemValueFontWeight: 'normal',
        navButtonFill: '#000',
        navButtonFillOpacity: 0.65,
        navPageNumFill: '#000',
        navPageNumFillOpacity: 0.45,
        navPageNumFontSize: 12,
        gridCol: 100,
        gridRow: 1,
        rowPadding: 0,
        colPadding: 8,
      },
    })
  );

  return group;
};

CategoryItems12.tags = ['分类图例', '图例组'];
