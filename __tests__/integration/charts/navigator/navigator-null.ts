import { Group, Text, Rect } from '@antv/g';
import { Navigator } from '../../../../src/ui/navigator';

export const NavigatorNull = () => {
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
        style: {
          loop: true,
        },
      },
    })
  );

  setTimeout(() => {
    createPageViews(2, [100, 100]).forEach((page) => {
      nav.getContainer().appendChild(page);
    });
    nav.update({
      style: {
        initPage: 1,
        x: 150,
        y: 150,
        pageWidth: 100,
        pageHeight: 100,
      },
    });
  }, 1000);

  return group;
};

NavigatorNull.tags = ['分页器', '空页'];
