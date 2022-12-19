import { Group } from '@antv/g';
import { CategoryItem } from '../../../../src/ui/legend/category/item';
import { flowItemData, colors } from '../legend/data';

export const BugCategoryItemUpdate = () => {
  const group = new Group();

  const item = group.appendChild(
    new CategoryItem({
      style: {
        label: 'label',
        value: 'value',
        spacing: [5, 5],
        markerFill: 'green',
        labelFill: 'green',
        valueFill: 'green',
        backgroundFill: '#f7f7f7',
      },
    })
  );

  setTimeout(() => {
    // 期望变成红色
    item.update({ markerFill: 'red', labelFill: 'red', valueFill: 'red' });
  }, 1000);

  return group;
};

BugCategoryItemUpdate.tags = ['BUG', '不更新'];
