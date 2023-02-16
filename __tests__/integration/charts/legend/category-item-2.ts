import { Group } from '@antv/g';
import { CategoryItem } from './utils';

export const CategoryItem2 = () => {
  const group = new Group({
    style: {
      width: 100,
      height: 20,
    },
  });

  group.appendChild(
    new CategoryItem({
      style: {
        style: {
          label: 'label',
          value: 'value',
          width: 80,
          markerFill: 'red',
          labelFill: 'red',
          valueFill: 'green',
          backgroundFill: '#f7f7f7',
        },
      },
    })
  );

  return group;
};

CategoryItem2.tags = ['分类图例', '图例项', '固定宽度', '80px'];
