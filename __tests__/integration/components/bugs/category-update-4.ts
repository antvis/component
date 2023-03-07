import { Group, DisplayObject } from '@antv/g';
import { Category } from '../../../../src/ui/legend';
import { timeout } from '../../utils';
import { flowItemData } from '../legend/data';

export const BugCategoryUpdate4 = () => {
  const group = new Group();

  const category = group.appendChild(
    new Category({
      style: {
        data: flowItemData,
        layout: 'grid',
        height: 100,
        width: 400,
        gridRow: 1,
        gridCol: 3,
        titleText: 'Legend Title',
        itemMarkerFill: '#d3d2d3',
      },
    })
  );

  let item1: DisplayObject;
  let item2: DisplayObject;

  timeout(() => {
    item1 = category.querySelectorAll('.items-item')[0] as DisplayObject;
    category.update({
      data: flowItemData.slice(0, 2),
    });
    timeout(() => {
      item2 = category.querySelectorAll('.items-item')[0] as DisplayObject;
      console.assert(item1 === item2, 'item1 should be equal to item2');
      if (item1 !== item2) {
        throw new Error('item1 should be equal to item2');
      }
    });
  }, 100);

  return group;
};

BugCategoryUpdate4.tags = ['BUG', '更新布局'];
