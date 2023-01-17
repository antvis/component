import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { createGrid } from '../../utils';

export const LayoutFlexNest = () => {
  const group = new Group();

  createGrid(group, 100);

  const [width, height] = [100, 100];

  const box1 = group.appendChild(
    new Layout({
      style: {
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
      },
    })
  );

  group.appendChild(
    new Rect({
      style: {
        x: 50,
        y: 0,
        width: 50,
        height: 50,
        stroke: 'orange',
        strokeWidth: 2,
      },
    })
  );

  group.appendChild(
    new Rect({
      style: {
        x: 55,
        y: 5,
        width: 40,
        height: 40,
        stroke: 'red',
        strokeWidth: 1,
      },
    })
  );

  group.appendChild(
    new Rect({
      style: {
        x: 60,
        y: 10,
        width: 30,
        height: 30,
        stroke: 'green',
        strokeWidth: 1,
      },
    })
  );

  const box2 = new Layout({
    style: {
      width: 40,
      height: 40,
      margin: 5,
      padding: 5,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  ['red', 'green'].forEach((color) => {
    box2.appendChild(
      new Rect({
        style: {
          width: 10,
          height: 10,
          fill: color,
        },
      })
    );
  });

  console.log(box2.getAvailableSpace(), box2.getBBox());

  box1.appendChild(box2);

  return group;
};

LayoutFlexNest.tags = ['布局', '嵌套'];
