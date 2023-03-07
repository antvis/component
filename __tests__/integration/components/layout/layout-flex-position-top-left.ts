import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { createGrid } from '../../utils';

export const LayoutFlexPositionTopLeft = () => {
  const group = new Group();

  createGrid(group, 100);

  const box = group.appendChild(
    new Layout({
      style: {
        width: 100,
        height: 100,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
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

LayoutFlexPositionTopLeft.tags = ['布局', 'Position', 'TopLeft'];
