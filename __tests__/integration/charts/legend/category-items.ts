import { Group, Image, Rect, Text } from '@antv/g';
import { CategoryItems as CIs } from './utils';

export const CategoryItems = () => {
  const group = new Group({});
  const colors = ['red', 'orange', 'green', 'blue', 'purple'];
  const createItemData = (num: number) => {
    return new Array(num).fill(0).map((d, i) => ({
      id: `${i + 1}`,
      label: `${i + 1}-label`,
      value: `${i + 1}-value`,
      extInfo: 'further text',
    }));
  };

  const createItems = (args: any) => {
    const { width = 300, height = 90, gridRow = 3, gridCol = 3, rowPadding = 0, colPadding = 0 } = args;
    return group.appendChild(
      new CIs({
        style: {
          width,
          height,
          gridRow,
          gridCol,
          data: createItemData(20),
          itemLabelFill: 'red',
          itemValueFill: 'green',
          itemMarkerFill: 'orange',
          ...args,
        },
      })
    );
  };

  createItems({
    x: 100,
    y: 100,
    colPadding: 10,
    rowPadding: 5,
    itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
  });

  const items = createItems({ x: 500, y: 100, orient: 'vertical' });
  // @ts-ignore
  items.attr('itemMarkerFill', (d: any, i: number) => (i % 2 === 0 ? 'pink' : 'purple'));

  createItems({
    x: 100,
    y: 250,
    gridCol: 1,
    gridRow: 5,
    width: 100,
    height: 210,
    rowPadding: 10,
    orient: 'vertical',
    navDuration: 10000,
    itemMarker: () => new Rect({ style: { width: 16, height: 16, fill: 'red' } }),
    itemMarkerFill: (_: any, index: number) => (index % 2 === 0 ? 'red' : 'green'),
  });

  createItems({
    x: 350,
    y: 250,
    gridCol: 3,
    gridRow: 1,
    width: 500,
    height: 30,
    navDuration: 1000,
    navLoop: true,
    colPadding: 10,
    itemMarker: (_: any) =>
      new Image({
        style: {
          width: 16,
          height: 16,
          src: 'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
        },
      }),
    navFormatter: (curr: number, total: number) => `第${curr}页(共${total}页)`,
    navButtonFill: 'blue',
    navButtonTransform: 'scale(0.8)',
    navControllerSpacing: 10,
    navPageNumFill: 'red',
    click: (el: any) => {
      alert(`you clicked item: ${el.attr('label')} - ${el.attr('value')}`);
    },
    mouseenter: (el: any) => {
      console.log('mouseenter item: ', el.attr('label'), el.attr('value'));
      el.querySelector('.legend-category-item-background').attr('fill', '#f4bb51');
    },
    mouseleave: (el: any) => {
      el.querySelector('.legend-category-item-background').attr('fill', 'white');
    },
  });

  group.appendChild(new Text({ style: { x: 350, y: 300, text: 'try to hover to the items⬆️' } }));
  group.appendChild(new Text({ style: { x: 600, y: 300, text: 'try to click to the items⬆️' } }));

  const items3 = group.appendChild(
    new CIs({
      style: {
        x: 400,
        y: 350,
        width: 500,
        height: 50,
        orient: 'horizontal',
        gridRow: 2,
        gridCol: 8,
        data: createItemData(20).map(({ value, ...rest }) => ({ ...rest })),
      },
    })
  );

  return group;
};
