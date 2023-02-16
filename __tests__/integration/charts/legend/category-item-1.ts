import { Group } from '@antv/g';
import { CategoryItem } from './utils';

export const CategoryItem1 = () => {
  const group = new Group({
    style: {
      width: 200,
      height: 20,
    },
  });

  group.appendChild(
    new CategoryItem({
      style: {
        style: {
          label: 'pre-colonial Americas1',
          value: '100%',
          labelFill: 'red',
          valueFill: 'green',
          markerFill: 'red',
          spacing: [5, 5],
          backgroundFill: '#f7f7f7',
        },
      },
    })
  );

  return group;
};

CategoryItem1.tags = ['分类图例', '图例项', '样式自定义', '宽度自适应'];
