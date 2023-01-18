import { Group } from '@antv/g';
import { CategoryItem } from './utils';

export const CategoryItem3 = () => {
  const group = new Group({
    style: {
      width: 100,
      height: 20,
    },
  });

  group.appendChild(
    new CategoryItem({
      style: {
        label: 'label',
        value: 'value',
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

CategoryItem3.tags = ['分类图例', '图例项', '自适应宽度', '设置间隔'];
