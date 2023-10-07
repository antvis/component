import { Group, Path } from '@antv/g';
import { circle, triangle, diamond } from '../../../../src/ui/marker/symbol';
import { CategoryItem } from './utils';

export const CategoryItem10 = () => {
  const group = new Group({
    style: {
      width: 200,
      height: 150,
    },
  });

  const addItem = (y: number, shape: any) => {
    group.appendChild(
      new CategoryItem({
        style: {
          y,
          labelText: 'this is a long label text',
          width: 200,
          spacing: [5, 5],
          marker: () =>
            new Path({
              style: {
                path: shape(0, 0, 6),
              },
            }),
          markerStroke: 'green',
          markerStrokeWidth: 2,
          markerStrokeOpacity: 0.5,
          markerSize: 50,
          labelFill: 'red',
          backgroundStroke: 'pink',
        },
      })
    );
  };

  addItem(0, circle);
  addItem(50, triangle);
  addItem(100, diamond);

  return group;
};

CategoryItem10.tags = ['分类图例', '图例项', '描边样式', 'Path'];
