import { Group } from '@antv/g';
import { CategoryItem } from './utils';

export const CategoryItem9 = () => {
  const group = new Group({
    style: {
      width: 200,
      height: 50,
    },
  });

  group.appendChild(
    new CategoryItem({
      style: {
        labelText: 'this is a long label text',
        width: 200,
        spacing: [5, 5],
        markerFill: 'orange',
        markerStroke: 'green',
        markerStrokeWidth: 2,
        markerStrokeOpacity: 0.5,
        markerSize: 50,
        labelFill: 'red',
        backgroundFill: 'pink',
      },
    })
  );

  return group;
};

CategoryItem9.tags = ['分类图例', '图例项', '描边样式'];
