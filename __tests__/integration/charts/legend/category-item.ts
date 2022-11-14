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

  createItem({ x: 100, y: 350, width: undefined, height: undefined, spacing: [5, 5] });

  createItem({ x: 100, y: 400, width: undefined, height: undefined, value: '', spacing: [5, 5] });

  group.appendChild(
    new CI({
      style: {
        x: 300,
        y: 50,
        label: 'pre-colonial Americas',
        labelFill: 'red',
        markerFill: 'red',
      },
    })
  );

  const item2 = group.appendChild(
    new CI({
      style: {
        x: 300,
        y: 100,
        label: 'pre-colonial Americas',
        labelFill: 'red',
        markerFill: 'red',
      },
    })
  );

  item2.attr('width', 60);

  group.appendChild(
    new CI({
      style: {
        x: 300,
        y: 150,
        label: 'pre-colonial Americas',
        labelFill: 'red',
        value: '100%',
        valueFill: 'green',
        markerFill: 'red',
        spacing: [5, 5],
      },
    })
  );

  return group;
};
