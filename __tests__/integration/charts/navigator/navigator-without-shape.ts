import { Group, Text, Rect } from '@antv/g';
import { Navigator } from '../../../../src/ui/navigator';

export const NavigatorWithoutShape = () => {
  const group = new Group();

  const createPageViews = (count: number, [w, h]: [number, number], formatter = (str: any) => `page - ${str}`) => {
    return new Array(count).fill(0).map((_, index) => {
      const g = new Group();
      const rect = new Rect({
        style: {
          width: w,
          height: h,
          stroke: 'red',
          fill: '#f7f7f7',
        },
      });
      rect.appendChild(
        new Text({
          style: {
            text: formatter(index + 1),
            x: w / 2,
            y: h / 2,
            textAlign: 'center',
          },
        })
      );
      g.appendChild(rect);
      return g;
    });
  };

  const createNav = (args = {}, size = 5) => {
    const nav = new Navigator({
      style: {
        loop: true,
        pageViews: createPageViews(size, [100, 100]),
        ...args,
      },
    });
    group.appendChild(nav);
    return nav;
  };

  createNav({
    x: 10,
    y: 10,
    pageWidth: 100,
    pageHeight: 100,
  });

  createNav({
    x: 10,
    y: 120,
  });

  const nav3 = createNav({
    x: 10,
    y: 230,
  });

  nav3.style.pageWidth = 100;
  nav3.style.pageHeight = 100;

  return group;
};
