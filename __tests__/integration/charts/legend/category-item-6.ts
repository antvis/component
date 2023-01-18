import { Group } from '@antv/g';
import { CategoryItem } from './utils';

export const CategoryItem6 = () => {
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
        width: 50,
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

CategoryItem6.tags = ['分类图例', '图例项', '标签缩略'];
