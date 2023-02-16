import { Group, Rect } from '@antv/g';
import { Category } from '../../../../src/ui/legend';

export const BugCategoryWithShape1 = () => {
  const group = new Group();

  const [width, height] = [300, 65];
  const rect = group.appendChild(
    new Rect({
      style: {
        x: 50,
        y: 50,
        width,
        height,
        stroke: 'red',
      },
    })
  );

  // without title
  rect.appendChild(
    new Category({
      style: {
        style: { width, height, gridCol: 10, gridRow: 10, itemMarkerFill: '#d3d2d3' },
        data: new Array(10).fill(0).map((d: any, i: number) => ({
          label: `label-${i}`,
          value: `value-${i}`,
        })),
      },
    })
  );

  return group;
};
