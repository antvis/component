import { Group } from '@antv/g';
import { Category } from '../../../../src/ui/legend';
import { flowItemData } from '../legend/data';

export const BugCategoryUpdate3 = () => {
  const group = new Group();

  const category = group.appendChild(
    new Category({
      style: {
        layout: 'grid',
        height: 100,
        width: 400,
        gridRow: 1,
        gridCol: 3,
        data: flowItemData,
        titleText: 'Legend Title',
        itemMarkerFill: '#d3d2d3',
      },
    })
  );

  setTimeout(() => {
    category.update({ gridRow: 2 });
  }, 1000);

  setTimeout(() => {
    category.update({ gridCol: 4 });
  }, 2000);

  setTimeout(() => {
    category.update({ gridRow: 1, gridCol: 3 });
  }, 3000);

  return group;
};

BugCategoryUpdate3.tags = ['BUG', '更新布局'];
