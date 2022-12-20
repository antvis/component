import { Group, Text, Rect } from '@antv/g';
import { Navigator } from '../../../../src/ui/navigator';

export const NavigatorSingle = () => {
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
            textBaseline: 'middle',
          },
        })
      );
      g.appendChild(rect);
      return g;
    });
  };

  const nav = group.appendChild(
    new Navigator({
      style: {
        x: 100,
        y: 100,
        pageWidth: 100,
        pageHeight: 100,
        loop: true,
      },
    })
  );

  createPageViews(1, [100, 100]).forEach((page) => {
    nav.getContainer().appendChild(page);
  });

  return group;
};

NavigatorSingle.tags = ['分页器', '单页'];
