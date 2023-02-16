import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { createGrid } from '../../utils';

export const LayoutFlexAlignItemsFlexStart = () => {
  const group = new Group();
  createGrid(group, 100);
  const box = group.appendChild(
    new Layout({
      style: {
        width: 100,
        height: 100,
        display: 'flex',
        alignItems: 'flex-start',
      },
    })
  );

  const colors = ['red', 'green', 'blue', 'yellow', 'pink', 'orange', 'purple', 'cyan', 'magenta', 'brown'];
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

  return group;
};

LayoutFlexAlignItemsFlexStart.tags = ['布局', 'align-items', 'flex-start'];
