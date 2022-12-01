import { Group, Image, Text } from '@antv/g';
import { CategoryItems, createItemData } from './utils';

export const CategoryItems4 = () => {
  const group = new Group();

  group.appendChild(
    new CategoryItems({
      style: {
        layout: 'grid',
        data: createItemData(20),
        itemLabelFill: 'red',
        itemValueFill: 'green',
        gridCol: 4,
        gridRow: 1,
        width: 555,
        height: 30,
        navDuration: 1000,
        navLoop: true,
        colPadding: 10,
        // 注意这里是一个高阶函数
        itemMarker: (_: any) => () =>
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
      },
    })
  );

  group.appendChild(new Text({ style: { x: 0, y: 50, text: 'try to hover to the items⬆️' } }));
  group.appendChild(new Text({ style: { x: 250, y: 50, text: 'try to click to the items⬆️' } }));

  return group;
};

CategoryItems4.tags = ['分类图例', '图例组', '网格布局', '自定义图标', '事件响应', '点击', 'hover'];
