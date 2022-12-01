import { Group } from '@antv/g';
import { Category } from '../../../../src/ui/legend';

export const BugCategoryLabelDisplay = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        data: [
          {
            id: 'Seattle',
            label: 'Seattle',
            value: '',
            color: '#5B8FF9',
          },
          {
            id: 'New York',
            label: 'New York',
            value: '',
            color: '#5AD8A6',
          },
        ],
        x: 50,
        y: 0,
        orient: 'horizontal',
        width: 220,
        height: 40,
        rowPadding: 0,
        colPadding: 8,
        titleText: 'location',
        titleFontSize: 12,
        titleFontWeight: 'bold',
        titleFillOpacity: 1,
        itemMarkerFillOpacity: 1,
        itemMarkerD: [['M', 0, 4], ['A', 4, 4, 0, 1, 0, 8, 4], ['A', 4, 4, 0, 1, 0, 0, 4], ['Z']],
      },
    })
  );

  return group;
};
