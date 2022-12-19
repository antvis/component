import { Group } from '@antv/g';
import { CategoryItems } from '../../../../src/ui/legend/category/items';
import { flowItemData, colors } from '../legend/data';

export const BugCategoryItemsUpdate = () => {
  const group = new Group();

  const items = group.appendChild(
    new CategoryItems({
      style: {
        width: 400,
        height: 100,
        gridRow: 2,
        layout: 'grid',
        data: flowItemData,
        itemLabelFill: 'green',
        itemValueFill: 'green',
        colPadding: 10,
        rowPadding: 5,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  setTimeout(() => {
    // 期望变成红色
    items.update({
      itemLabelFill: 'red',
      itemMarkerFill: 'red',
    });
  }, 1000);

  return group;
};

BugCategoryItemsUpdate.tags = ['BUG', '不更新'];
