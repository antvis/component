import { Group } from '@antv/g';
import { Category as C, smooth } from './utils';

export const CategoryPosition = () => {
  const group = new Group();

  const createItemData = (num: number) => {
    return new Array(num).fill(0).map((d, i) => ({
      id: `${i + 1}`,
      label: `${i + 1}-label`,
      value: `${i + 1}-value`,
      extInfo: 'further text',
    }));
  };

  const colors = ['#5781f0', '#70d2a0', '#556484', '#efb745', '#5f4fee'];

  const g1 = group.appendChild(new Group());

  g1.appendChild(
    new C({
      style: {
        layout: 'grid',
        data: createItemData(20),
        titleText: 'Legend Title',
        width: 455,
        height: 50,
        gridCol: 6,
        gridRow: 1,
        itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
      },
    })
  );

  const g2 = group.appendChild(
    new Group({
      style: {
        x: 100,
        y: 100,
      },
    })
  );

  g2.appendChild(
    new C({
      style: {
        layout: 'grid',
        data: createItemData(20),
        titleText: 'Legend Title',
        width: 455,
        height: 50,
        gridCol: 6,
        gridRow: 1,
        itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
      },
    })
  );

  group.appendChild(
    new C({
      style: {
        x: 100,
        y: 200,
        layout: 'grid',
        data: createItemData(20),
        titleText: 'Legend Title',
        width: 455,
        height: 50,
        gridCol: 6,
        gridRow: 1,
        itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
      },
    })
  );

  return group;
};
