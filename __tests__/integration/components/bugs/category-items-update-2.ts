import { Group } from '@antv/g';
import { CategoryItems } from '../../../../src/ui/legend/category/items';
import { timeout } from '../../utils';
import { flowItemData } from '../legend/data';

export const BugCategoryItemsUpdate2 = () => {
  const group = new Group();

  const items = group.appendChild(
    new CategoryItems({
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
    items.update({ width: 500 });
  }, 1000);

  timeout(() => {
    items.update({ width: 300 });
  }, 2000);

  timeout(() => {
    items.update({ colPadding: 0, rowPadding: 0 });
  }, 3000);

  return group;
};

BugCategoryItemsUpdate2.tags = ['BUG', '图例项', '更新样式'];
