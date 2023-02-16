import { Group } from '@antv/g';
import { Category } from '../../../../src/ui/legend';
import { flowItemData, colors } from '../legend/data';

export const BugCategoryUpdate1 = () => {
  const group = new Group();

  const category = group.appendChild(
    new Category({
      className: 'category-legend',
      style: {
        data: flowItemData,
        style: {
          y: 30,
          layout: 'flex',
          width: 400,
          height: 100,
          gridRow: 2,
          itemLabelFill: 'green',
          itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        },
      },
    })
  );

  setTimeout(() => {
    // 期望变成红色
    category.update({ style: { itemLabelFill: 'red' } });
  }, 1000);

  return group;
};

BugCategoryUpdate1.tags = ['BUG', '更新样式'];
