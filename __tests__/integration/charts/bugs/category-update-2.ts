import { Group } from '@antv/g';
import { Category } from '../../../../src/ui/legend';
import { flowItemData, colors } from '../legend/data';

export const BugCategoryUpdate2 = () => {
  const group = new Group();

  const category = group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        style: {
          y: 30,
          layout: 'flex',
          width: 600,
          height: 100,
          gridRow: 2,
          gridCol: 4,
          itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        },
      },
    })
  );

  setTimeout(() => {
    category.update({ style: { width: 300 } });
  }, 1000);

  // setTimeout(() => {
  //   category.update({ width: 600 });
  // }, 2000);

  return group;
};

BugCategoryUpdate2.tags = ['BUG', '更新布局', '分页', '不分页'];
