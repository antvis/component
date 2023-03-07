import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { createGrid } from '../../utils';

export const LayoutFlexPositionLeft = () => {
  const group = new Group();

  createGrid(group, 100);

  const box = group.appendChild(
    new Layout({
      style: {
        width: 100,
        height: 100,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
    })
  );

  box.appendChild(
    new Rect({
      style: {
        width: 10,
        height: 10,
        fill: 'red',
      },
    })
  );

  return group;
};

LayoutFlexPositionLeft.tags = ['布局', 'Position', 'Left'];
