import { Group, Rect, Circle } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryItemMarker1 = () => {
  const group = new Group({
    style: {
      width: 750,
      height: 50,
    },
  });

  group.appendChild(
    new Category({
      style: {
        layout: 'flex',
        height: 40,
        data: flowItemData,
        titleText: 'Legend Title',
        width: 1000,
        itemMarker: (d, i) =>
          i % 2 === 0
            ? () =>
                new Rect({
                  style: {
                    x: -5,
                    y: -5,
                    width: 10,
                    height: 10,
                    transformOrigin: 'center',
                    transform: 'rotate(45)',
                  },
                })
            : () =>
                new Circle({
                  style: {
                    r: 5,
                  },
                }),
        itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
        itemValue: '',
      },
    })
  );

  return group;
};

CategoryItemMarker1.tags = ['分类图例', '图标', '自定义'];
