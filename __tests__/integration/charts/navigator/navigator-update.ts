import { Group, Text, Rect } from '@antv/g';
import { Navigator } from '../../../../src/ui/navigator';

export const NavigatorUpdate = () => {
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
        pageViews: [],
      },
    })
  );

  // update page views
  setTimeout(() => {
    nav.update({
      x: 100,
      y: 100,
      loop: true,
      pageViews: createPageViews(10, [100, 100], (str) => `page - ${str} \n updated`),
    });
  }, 1000);

  // update page size
  setTimeout(() => {
    nav.update({
      pageWidth: 200,
      pageHeight: 200,
      pageViews: createPageViews(10, [200, 200], (str) => `page - ${str} \n update \n page size`),
    });
  }, 2000);

  // set page num
  setTimeout(() => {
    nav.update({
      initPage: 4,
    });
  }, 3000);

  setTimeout(() => {
    nav.update({
      pageWidth: 100,
      pageHeight: 100,
      pageViews: createPageViews(10, [100, 100], (str) => `page - ${str} \n updated`),
    });
  }, 4000);

  return group;
};

NavigatorUpdate.tags = ['分页器', '更新'];
