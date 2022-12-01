import { Group } from '@antv/g';
import { CategoryItem } from './utils';

export const CategoryItem2 = () => {
  const group = new Group();

  group.appendChild(
    new CategoryItem({
      style: {
        width: 80,
        label: 'label',
        value: 'value',
        markerFill: 'red',
        labelFill: 'red',
        valueFill: 'green',
        backgroundFill: '#f7f7f7',
      },
    })
  );

  return group;
};

CategoryItem2.tags = ['分类图例', '图例项', '固定宽度', '80px'];
