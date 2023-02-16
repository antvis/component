import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { createGrid } from '../../utils';

export const LayoutUpdateAttr = () => {
  const group = new Group();
  createGrid(group, 200);
  const box = group.appendChild(
    new Layout({
      style: {
        width: 100,
        height: 100,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
    })
  );

  const colors = ['red', 'green', 'blue', 'yellow', 'pink'];
  new Array(5).fill(0).forEach((d: any, i: number) =>
    box.appendChild(
      new Rect({
        style: {
          width: 10,
          height: 10,
          fill: colors[i],
        },
      })
    )
  );

  box.attr('width', 200);
  box.attr('height', 200);

  return group;
};

LayoutUpdateAttr.tags = ['布局', 'flex-direction', 'row'];
