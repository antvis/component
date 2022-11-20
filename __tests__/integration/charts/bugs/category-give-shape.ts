import { Group, Rect } from '@antv/g';
import { Category } from '../../../../src/ui/legend';

export const BugCategoryWithShape = () => {
  const group = new Group();

  const width1 = 300;
  const rect = group.appendChild(
    new Rect({
      style: {
        x: 50,
        y: 50,
        width: width1,
        height: 65,
        stroke: 'red',
      },
    })
  );

  // without title
  rect.appendChild(
    new Category({
      style: {
        width: width1,
        height: 65,
        gridCol: 10,
        gridRow: 10,
        data: new Array(10).fill(0).map((d, i) => ({
          label: `label-${i}`,
          value: `value-${i}`,
        })),
      },
    })
  );

  const width2 = 350;
  const rect2 = group.appendChild(
    new Rect({
      style: {
        x: 50,
        y: 150,
        width: width2,
        height: 60,
        stroke: 'red',
      },
    })
  );

  // with title
  rect2.appendChild(
    new Category({
      style: {
        titleText: 'title',
        titleFontSize: 20,
        width: width2,
        height: 60,
        gridCol: 10,
        gridRow: 10,
        data: new Array(20).fill(0).map((d, i) => ({
          label: `label-${i}`,
          value: `value-${i}`,
        })),
      },
    })
  );

  group.appendChild(
    new Category({
      style: {
        x: 50,
        y: 250,
        width: 300,
        height: 300,
        gridRow: undefined,
        gridCol: 1,
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
