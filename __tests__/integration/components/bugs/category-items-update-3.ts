import { Group } from '@antv/g';
import { CategoryItems } from '../../../../src/ui/legend/category/items';
import { timeout } from '../../utils';
import { flowItemData } from '../legend/data';

export const BugCategoryItemsUpdate3 = () => {
  const group = new Group();

  const items = group.appendChild(
    new CategoryItems({
      className: 'category-items-3',
      style: {
        data: flowItemData,
        width: 400,
        height: 100,
        gridRow: 2,
        gridCol: 3,
        layout: 'grid',
        itemMarkerFill: '#d3d2d3',
        itemLabelFill: 'green',
        itemValueFill: 'green',
        colPadding: 10,
        rowPadding: 5,
      },
    })
  );

  timeout(() => {
    items.update({ gridCol: 7 });
  }, 1000);

  timeout(() => {
    items.update({ gridCol: 2 });
  }, 2000);

  timeout(() => {
    items.update({ width: 300 });
  }, 300);

  return group;
};

BugCategoryItemsUpdate3.tags = ['BUG', '分页', '更新', '不分页'];
