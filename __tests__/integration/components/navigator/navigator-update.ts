import { Group, Rect } from '@antv/g';
import { Navigator } from '../../../../src/ui/navigator';
import { Text } from '../../../../src/shapes';
import { timeout } from '../../utils';

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
      style: {},
    })
  );

  // update page views
  timeout(() => {
    nav.update({
      x: 100,
      y: 100,
      loop: true,
    });
    createPageViews(10, [100, 100], (str) => `page - ${str} \n updated`).forEach((page) => {
      nav.getContainer().appendChild(page);
    });
  }, 1000);

  // update page size
  timeout(() => {
    nav.update({
      pageWidth: 200,
      pageHeight: 200,
    });
    nav.getContainer().destroyChildren();
    createPageViews(10, [200, 200], (str) => `page - ${str} \n update \n page size`).forEach((page) => {
      nav.getContainer().appendChild(page);
    });
  }, 2000);

  // set page num
  timeout(() => {
    nav.update({
      initPage: 4,
    });
  }, 3000);

  timeout(() => {
    nav.update({
      pageWidth: 100,
      pageHeight: 100,
    });
    nav.getContainer().destroyChildren();
    createPageViews(10, [100, 100], (str) => `page - ${str} \n updated`).forEach((page) => {
      nav.getContainer().appendChild(page);
    });
  }, 4000);

  return group;
};

NavigatorUpdate.tags = ['分页器', '更新'];
