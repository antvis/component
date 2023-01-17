import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { createGrid } from '../../utils';

export const LayoutFlexManipulateChildren = () => {
  const group = new Group();

  createGrid(group, 100);

  const box = group.appendChild(
    new Layout({
      style: {
        width: 100,
        height: 100,
        display: 'flex',
        alignItems: 'flex-end',
      },
    })
  );

  const rect = box.appendChild(
    new Rect({
      style: {
        width: 10,
        height: 10,
        fill: 'red',
      },
    })
  );

  box.appendChild(
    new Rect({
      style: {
        width: 20,
        height: 20,
        fill: 'green',
      },
    })
  );

  box.appendChild(
    new Rect({
      style: {
        width: 15,
        height: 15,
        fill: 'blue',
      },
    })
  );

  setTimeout(() => {
    rect.style.x = 30;
    rect.style.width = 20;
    rect.style.height = 40;
  });

  return group;
};

LayoutFlexManipulateChildren.tags = ['布局', '操作子元素'];
