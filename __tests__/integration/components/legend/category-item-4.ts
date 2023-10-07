import { Group } from '@antv/g';
import { CategoryItem } from './utils';

export const CategoryItem4 = () => {
  const group = new Group({
    style: {
      width: 100,
      height: 20,
    },
  });

  group.appendChild(
    new CategoryItem({
      style: {
        labelText: 'label',
        spacing: [5, 5],
        markerFill: 'red',
        labelFill: 'red',
        valueFill: 'green',
        backgroundFill: '#f7f7f7',
      },
    })
  );

  return group;
};

CategoryItem4.tags = ['分类图例', '图例项', '自适应宽度', '无value'];
