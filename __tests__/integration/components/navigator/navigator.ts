import { Group, Rect } from '@antv/g';
import { Text } from '../../../../src/shapes';
import { interval, timeout } from '../../utils';
import { Navigator } from '../../../../src/ui/navigator';

export const NavigatorDemo = () => {
  const group = new Group({
    style: {
      width: 810,
      height: 350,
    },
  });

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
        pageWidth: 100,
        pageHeight: 100,
        loop: true,
        ...args,
      },
    });
    createPageViews(size, [100, 100]).forEach((page) => {
      nav.getContainer().appendChild(page);
    });
    group.appendChild(nav);
    return nav;
  };

  const nav1 = createNav({ x: 100, y: 100 });
  interval(() => {
    nav1.next();
  }, 1000);

  const nav2 = createNav({ x: 300, y: 100, orientation: 'vertical', duration: 1000 });
  interval(() => {
    nav2.prev();
  }, 1000);

  const nav3 = createNav({ x: 450, y: 100, duration: 1000, effect: 'in-quart' });
  interval(() => {
    nav3.next();
  }, 1000);

  const nav4 = createNav({ x: 650, y: 100, initPage: 3, orientation: 'vertical' });

  timeout(() => {
    nav4.next()?.finished.then(() => {
      timeout(() => {
        nav4.update({ initPage: 2 });
      }, 1000);
    });
  }, 1000);

  const nav5 = createNav({ x: 100, y: 250, initPage: 3 });

  timeout(() => {
    nav5.getContainer().destroyChildren();
    createPageViews(10, [100, 100], (str) => `nav5-${str}`).forEach((page) => {
      nav5.getContainer().appendChild(page);
    });
    interval(() => {
      nav5.next();
    }, 1000);
  }, 1000);

  createNav({ x: 300, y: 250, initPage: 3, buttonTransform: 'scale(0.8)', pageNumFontSize: 14 }, 20);
  createNav({ x: 500, y: 250 }, 1);

  return group;
};

NavigatorDemo.wait = 500;
