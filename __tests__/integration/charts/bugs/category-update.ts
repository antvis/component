import { Group } from '@antv/g';
import { Category } from '../../../../src/ui/legend';
import { flowItemData, colors } from '../legend/data';

export const BugCategoryUpdate = () => {
  const group = new Group();

  const legend = group.appendChild(
    new Category({
      style: {
        y: 30,
        data: flowItemData,
        layout: 'flex',
        width: 400,
        height: 100,
        gridRow: 2,
        itemLabelFill: 'green',
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  setTimeout(() => {
    // 期望变成红色
    legend.update({ itemLabelFill: 'red' });
  }, 1000);

  return group;
};

BugCategoryUpdate.tags = ['BUG', '不更新'];
