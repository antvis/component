import { Group, DisplayObject } from '@antv/g';
import { Category } from '../../../../src/ui/legend';
import { timeout } from '../../utils';
import { flowItemData } from '../legend/data';

export const BugCategoryUpdate5 = () => {
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
        itemLabelFill: '#000',
        itemLabelFillOpacity: 0.65,
        itemLabelFontWeight: 'normal',
      },
    })
  );

  let item1: DisplayObject;

  timeout(() => {
    item1 = category.querySelectorAll('.items-item')[0] as DisplayObject;
    category.update({
      itemMarkerFill: '#d3d2d3',
      itemLabelFill: '#000',
      itemLabelFillOpacity: 0.65,
      itemLabelFontWeight: 'normal',
    });
  }, 100);

  return group;
};

BugCategoryUpdate5.tags = ['BUG', '更新字体'];
