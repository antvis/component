import { Group } from '@antv/g';
import { CategoryItem } from '../../../../src/ui/legend/category/item';

export const BugCategoryItemUpdate1 = () => {
  const group = new Group({
    style: {
      width: 100,
      height: 20,
    },
  });

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

BugCategoryItemUpdate1.tags = ['BUG', '不更新'];
