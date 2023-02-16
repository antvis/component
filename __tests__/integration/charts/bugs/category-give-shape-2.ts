import { Group, Rect } from '@antv/g';
import { Category } from '../../../../src/ui/legend';

export const BugCategoryWithShape2 = () => {
  const group = new Group();

  const [width, height] = [350, 60];
  const rect2 = group.appendChild(
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

  // with title
  rect2.appendChild(
    new Category({
      style: {
        style: {
          titleText: 'title',
          titleFontSize: 20,
          width,
          height,
          gridCol: 10,
          gridRow: 10,
          itemMarkerFill: '#d3d2d3',
        },
        data: new Array(20).fill(0).map((d: any, i: number) => ({
          label: `label-${i}`,
          value: `value-${i}`,
        })),
      },
    })
  );

  return group;
};
