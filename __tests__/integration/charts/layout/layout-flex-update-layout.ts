import { Group, Rect, Text } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { createGrid } from '../../utils';

export const LayoutFlexUpdateLayout = () => {
  const group = new Group();

  createGrid(group, 600);

  const flexDirections = ['column', 'row']; // , 'column-reverse', 'row-reverse'];
  const justifyContent = ['flex-start', 'center', 'flex-end']; // , 'space-between', 'space-around'];
  const alignItems = ['flex-start', 'center', 'flex-end']; // , 'stretch', 'baseline'];

  const [width, height] = [100, 100];

  const createLayout = (flexDirection: any, justifyContent: any, alignItems: any, position: any) => {
    group.appendChild(
      new Rect({
        style: {
          x: position.x,
          y: position.y,
          width,
          height,
          strokeWidth: 2,
          stroke: 'orange',
        },
      })
    );

    const box = group.appendChild(
      new Layout({
        style: {
          x: position.x,
          y: position.y,
          width,
          height,
          display: 'flex',
          flexDirection,
          justifyContent,
          alignItems,
        },
      })
    );

    group.appendChild(
      new Text({
        style: {
          x: position.x + width / 2,
          y: position.y + height / 2,
          fontSize: 10,
          textAlign: 'center',
          textBaseline: 'middle',
          text: `${flexDirection}\n${justifyContent}\n${alignItems}`,
        },
      })
    );

    ['red', 'green', 'blue'].forEach((color) => {
      box.appendChild(
        new Rect({
          style: {
            width: 10,
            height: 10,
            fill: color,
          },
        })
      );
    });
  };

  const [I, J, K] = [flexDirections.length, justifyContent.length, alignItems.length];
  const rowItems = 6;
  flexDirections.forEach((flexDirection, i) => {
    justifyContent.forEach((justifyContent, j) => {
      alignItems.forEach((alignItems, k) => {
        const index = i * J * K + j * K + k;
        createLayout(flexDirection, justifyContent, alignItems, {
          x: (index % rowItems) * width,
          y: Math.floor(index / rowItems) * height,
        });
      });
    });
  });

  return group;
};

LayoutFlexUpdateLayout.tags = ['布局', '更新布局'];
