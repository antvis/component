import { Group } from '@antv/g';
import { CategoryItems, createItemData } from './utils';

export const CategoryItems5 = () => {
  const group = new Group();

  group.appendChild(
    new CategoryItems({
      style: {
        width: 555,
        height: 50,
        layout: 'grid',
        orient: 'horizontal',
        gridRow: 2,
        gridCol: 8,
        itemMarkerFill: '#d3d2d3',
        data: createItemData(20).map(({ value, ...rest }) => ({ ...rest })),
      },
    })
  );

  return group;
};

CategoryItems5.tags = ['分类图例', '图例组', '网格布局', '无样式', '横向分页'];
