import { Group } from '@antv/g';
import { CategoryItems, createItemData } from './utils';

export const CategoryItemsPoptip4 = () => {
  const group = new Group();
  const colors = ['red', 'orange', 'green', 'blue', 'purple'];

  group.appendChild(
    new CategoryItems({
      style: {
        data: createItemData(20),
        layout: 'flex',
        itemLabelFill: 'red',
        itemValueFill: 'green',
        colPadding: 10,
        gridRow: 2,
        gridCol: 5,
        width: 650,
        height: 50,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        poptip: {
          render: (item) => `
            <div style="padding: 6px 10px; background-color: white; color: #333; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); font-size: 12px;">
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 5px; margin-right: 6px; background-color: ${item.color}"></span>
                <span style="font-weight: bold;">${item.label}</span>
              </div>
              <div style="padding-left: 16px;">
                <div>值: ${item.value}</div>
              </div>
            </div>
          `,
          domStyles: {
            '.component-poptip': {
              padding: '0',
            },
          },
        },
      },
    })
  );

  return group;
};

CategoryItemsPoptip4.tags = ['分类图例', '图例组', 'poptip', '自定义渲染'];
