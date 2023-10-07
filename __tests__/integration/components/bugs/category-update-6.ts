import { Group } from '@antv/g';
import { Category } from '../../../../src/ui/legend';
import { timeout } from '../../utils';

export const BugCategoryUpdate6 = () => {
  const group = new Group();

  const category = group.appendChild(
    new Category({
      style: {
        backgroundFill: 'transparent',
        itemBackgroundFill: 'transparent',
        itemLabelFill: '#000',
        itemLabelFillOpacity: 0.65,
        itemLabelFontSize: 12,
        itemLabelFontWeight: 'normal',
        itemMarkerFill: 'red',
        itemMarkerFillOpacity: 1,
        itemMarkerSize: 8,
        itemSpacing: [5, 8],
        itemValueFill: '#000',
        itemValueFillOpacity: 0.65,
        itemValueFontSize: 12,
        itemValueFontWeight: 'normal',
        navButtonFill: '#000',
        navButtonFillOpacity: 0.65,
        navPageNumFill: '#000',
        navPageNumFillOpacity: 0.45,
        navPageNumFontSize: 12,
        padding: 8,
        showTitle: false,
        titleFill: '#000',
        titleFillOpacity: 0.45,
        titleFontSize: 12,
        titleFontWeight: 'normal',
        titleSpacing: 4,
        orientation: 'horizontal',
        width: 725,
        height: 40,
        gridCol: 100,
        gridRow: 1,
        rowPadding: 0,
        colPadding: 8,
        titleText: 'category',
        data: [
          {
            id: 'setosa',
            label: 'setosa',
            color: '#5B8FF9',
          },
          {
            id: 'versicolor',
            label: 'versicolor',
            color: '#5AD8A6',
          },
          {
            id: 'virginica',
            label: 'virginica',
            color: '#5D7092',
          },
        ],
      },
    })
  );

  timeout(() => {
    category.update({});
  }, 100);

  return group;
};

BugCategoryUpdate6.tags = ['BUG', '更新字体'];
