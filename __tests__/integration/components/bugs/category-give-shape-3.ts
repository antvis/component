import { Group, Rect } from '@antv/g';
import { Category } from '../../../../src/ui/legend';

export const BugCategoryWithShape3 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        x: 50,
        y: 50,
        width: 300,
        height: 300,
        gridRow: undefined,
        gridCol: 1,
        itemMarkerFill: '#d3d2d3',
        data: [
          { label: 'Under 5 Years' },
          { label: '5 to 13 Years' },
          { label: '14 to 17 Years' },
          { label: '18 to 24 Years' },
          { label: '25 to 44 Years' },
          { label: '25 to 44 Years' },
          { label: '45 to 64 Years' },
          { label: '65 Years and Over' },
        ],
      },
    })
  );

  return group;
};
