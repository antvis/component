import { Group } from '@antv/g';
import { CategoryItem } from './utils';

export const CategoryItem7 = () => {
  const group = new Group({
    style: {
      width: 100,
      height: 20,
    },
  });

  group.appendChild(
    new CategoryItem({
      style: {
        label: 'this is a long label text',
        value: 'this is a long value text',
        width: 100,
        spacing: [5, 5],
        markerFill: 'orange',
        labelFill: 'red',
        valueFill: 'green',
        backgroundFill: '#f7f7f7',
      },
    })
  );

  return group;
};

CategoryItem7.tags = ['分类图例', '图例项', '标签缩略', '值缩略'];
