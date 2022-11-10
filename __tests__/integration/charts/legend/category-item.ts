import { Group, Rect } from '@antv/g';
import { CategoryItem as CI, createItemCfg } from './utils';

export const CategoryItem = () => {
  const group = new Group({});

  const createItem = (args: any) => {
    return group.appendChild(
      new CI({
        style: createItemCfg(args),
      })
    );
  };

  createItem({ x: 100, y: 100 });
  createItem({ x: 100, y: 150, width: 120, span: [1, 2, 2] });
  createItem({ x: 100, y: 200, span: [1, 2, 2] });
  createItem({
    x: 100,
    y: 250,
    span: [1, 2, 2],
    marker: () =>
      new Rect({
        style: {
          width: 10,
          height: 10,
          fill: 'orange',
          transformOrigin: 'center',
          transform: 'rotate(45)',
        },
      }),
  });
  const item = createItem({ x: 100, y: 300, span: [1, 4], value: undefined, label: 'labelLabelLabel' });

  item.style.markerFill = 'blue';

  return group;
};
